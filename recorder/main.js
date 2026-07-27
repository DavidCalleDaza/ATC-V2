const { app, BrowserWindow, ipcMain, dialog, desktopCapturer, session, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execSync } = require('child_process');
const AdmZip = require('adm-zip');

// Desactivar aceleración por hardware para forzar captura por software (evita crashes de DirectX/DXGI y UAC)
app.disableHardwareAcceleration();
// Desactivar WGC para evitar E_ACCESSDENIED (-2147024891) cuando se ejecuta como Administrador
app.commandLine.appendSwitch('disable-features', 'WebRtcWgcCapturer');
// Suppress GPU disk-cache errors when running from WSL on Windows paths
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disk-cache-size', '1');

const BASE_DIR = path.resolve(__dirname, '..');
const RECORDER_DIR = __dirname;

// Ruta al entorno virtual de Python
let PYTHON_EXEC = path.join(BASE_DIR, 'venv', 'bin', 'python3');
const isWindows = process.platform === 'win32';
const MAIN_PY = path.join(BASE_DIR, 'main.py');

function runPythonCommand(args) {
  return new Promise((resolve, reject) => {
    let cmd = PYTHON_EXEC;
    let finalArgs = [MAIN_PY, ...args];
    let spawnOptions = { cwd: BASE_DIR };
    // Usar la carpeta 'bin' en vez del archivo porque los symlinks de Linux fallan al leerse en SMB/Windows
    const isWslVenv = fs.existsSync(path.join(BASE_DIR, 'venv', 'bin'));

    // Si la app corre nativamente en Windows pero los archivos están en WSL (sea por wsl.localhost o disco montado Z:):
    if (isWindows && (BASE_DIR.includes('wsl.localhost') || isWslVenv)) {
      cmd = 'wsl.exe';
      let linuxBaseDir;
      let wslDistro = 'Ubuntu';
      
      if (BASE_DIR.includes('wsl.localhost')) {
        wslDistro = BASE_DIR.split('\\')[3] || 'Ubuntu';
        linuxBaseDir = BASE_DIR.substring(BASE_DIR.indexOf(wslDistro) + wslDistro.length).replace(/\\/g, '/');
      } else {
        linuxBaseDir = BASE_DIR.substring(2).replace(/\\/g, '/'); // Remueve "Z:" y convierte
      }
      
      const linuxPythonExec = `${linuxBaseDir}/venv/bin/python3`;
      const linuxMainPy = `${linuxBaseDir}/main.py`;
      
      const bashArgs = [linuxMainPy, ...args].map(a => `"${a}"`).join(' ');
      finalArgs = ['--', 'bash', '-c', `cd "${linuxBaseDir}" && "${linuxPythonExec}" ${bashArgs}`];
    } else if (isWindows) {
      cmd = path.join(BASE_DIR, 'venv', 'Scripts', 'python.exe');
    } else {
      cmd = fs.existsSync(PYTHON_EXEC) ? PYTHON_EXEC : 'python3';
    }

    const proc = spawn(cmd, finalArgs, spawnOptions);
    let stdout = '', stderr = '';

    proc.stdout.on('data', d => stdout += d.toString());
    proc.stderr.on('data', d => stderr += d.toString());

    proc.on('close', code => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`Python Error (${code}): ${stderr}`));
    });
  });
}

// ── IPC Handlers ──────────────────────────────────────────────────────────────

ipcMain.handle('get-projects', async () => {
  const projectsDir = path.join(BASE_DIR, 'projects');
  if (!fs.existsSync(projectsDir)) return [];
  
  return fs.readdirSync(projectsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name)
    .sort();
});

ipcMain.handle('get-sprints', async (_event, project) => {
  if (!project) return [];
  const projectDir = path.join(BASE_DIR, 'projects', project);
  if (!fs.existsSync(projectDir)) return [];
  
  return fs.readdirSync(projectDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.toLowerCase().startsWith('sprint-'))
    .map(e => e.name)
    .sort();
});

ipcMain.handle('get-hus', async (_event, { project, sprint }) => {
  const sprintDir = path.join(BASE_DIR, 'projects', project, sprint);
  if (!fs.existsSync(sprintDir)) return [];

  const folders = fs.readdirSync(sprintDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && (e.name.startsWith('CP_') || e.name.startsWith('HU')))
    .map(e => {
      const id = e.name.match(/HU-\d+/)?.[0] || e.name;
      const huDir = path.join(sprintDir, e.name);
      const wavPath = path.join(huDir, `${id}_guide.wav`);
      const mdPath = path.join(huDir, `${id}_guide.md`);
      
      const files = fs.readdirSync(huDir);
      const hasExcel = files.some(f => f.endsWith('.xlsx') && !f.startsWith('~$'));
      const hasWord = files.some(f => f.endsWith('.docx') && !f.startsWith('~$'));

      return {
        id,
        name: e.name,
        path: huDir,
        hasAudio: fs.existsSync(wavPath) && fs.existsSync(mdPath),
        hasExcel,
        hasWord
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
  return folders;
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function deleteDir(targetPath) {
  const isWslVenv = fs.existsSync(path.join(BASE_DIR, 'venv', 'bin'));
  if (isWindows && (BASE_DIR.includes('wsl.localhost') || isWslVenv)) {
    let linuxBaseDir;
    let wslDistro = 'Ubuntu';
    if (BASE_DIR.includes('wsl.localhost')) {
      wslDistro = BASE_DIR.split('\\')[3] || 'Ubuntu';
      linuxBaseDir = BASE_DIR.substring(BASE_DIR.indexOf(wslDistro) + wslDistro.length).replace(/\\/g, '/');
    } else {
      linuxBaseDir = BASE_DIR.substring(2).replace(/\\/g, '/');
    }
    const relative = path.relative(BASE_DIR, targetPath).replace(/\\/g, '/');
    const linuxTarget = `${linuxBaseDir}/${relative}`;
    const cmd = 'wsl.exe';
    const finalArgs = ['rm', '-rf', linuxTarget];
    execSync(`${cmd} ${finalArgs.map(a => `"${a}"`).join(' ')}`);
  } else {
    fs.rmSync(targetPath, { recursive: true, force: true });
  }
}

// ── Handlers de Creación, Edición y Eliminación ──────────────────────────────

ipcMain.handle('create-project', async (_event, projectName) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', projectName.trim());
    fs.mkdirSync(dir, { recursive: true });
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('rename-project', async (_event, { oldName, newName }) => {
  try {
    const oldDir = path.join(BASE_DIR, 'projects', oldName.trim());
    const newDir = path.join(BASE_DIR, 'projects', newName.trim());
    if (!fs.existsSync(oldDir)) throw new Error('El proyecto original no existe');
    if (fs.existsSync(newDir)) throw new Error('Ya existe un proyecto con ese nombre');
    fs.renameSync(oldDir, newDir);
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('delete-project', async (_event, projectName) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', projectName.trim());
    if (fs.existsSync(dir)) {
      deleteDir(dir);
    }
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('create-sprint', async (_event, { project, sprintName }) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', project, sprintName.trim());
    fs.mkdirSync(dir, { recursive: true });
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('rename-sprint', async (_event, { project, oldName, newName }) => {
  try {
    const oldDir = path.join(BASE_DIR, 'projects', project, oldName.trim());
    const newDir = path.join(BASE_DIR, 'projects', project, newName.trim());
    if (!fs.existsSync(oldDir)) throw new Error('El sprint original no existe');
    if (fs.existsSync(newDir)) throw new Error('Ya existe un sprint con ese nombre');
    fs.renameSync(oldDir, newDir);
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('delete-sprint', async (_event, { project, sprintName }) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', project, sprintName.trim());
    if (fs.existsSync(dir)) {
      deleteDir(dir);
    }
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('create-hu', async (_event, { project, sprint, huName }) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', project, sprint, huName.trim());
    fs.mkdirSync(dir, { recursive: true });
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('rename-hu', async (_event, { project, sprint, oldName, newName }) => {
  try {
    const oldDir = path.join(BASE_DIR, 'projects', project, sprint, oldName.trim());
    const newDir = path.join(BASE_DIR, 'projects', project, sprint, newName.trim());
    if (!fs.existsSync(oldDir)) throw new Error('La historia original no existe');
    if (fs.existsSync(newDir)) throw new Error('Ya existe una historia con ese nombre');
    fs.renameSync(oldDir, newDir);
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('delete-hu', async (_event, { project, sprint, huName }) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', project, sprint, huName.trim());
    if (fs.existsSync(dir)) {
      deleteDir(dir);
    }
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

// ── Import Project Handlers ──────────────────────────────────────────────────

ipcMain.handle('select-project-zip', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'ZIP Archives', extensions: ['zip'] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('select-project-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('import-project', async (_event, { source, type }) => {
  try {
    const projectsDir = path.join(BASE_DIR, 'projects');
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }

    let projectName;
    let tempDir = null;

    if (type === 'zip') {
      // Extract ZIP to temp directory
      const zip = new AdmZip(source);
      const entries = zip.getEntries();

      // Find root folder (first non-empty path segment)
      const rootFolders = new Set();
      entries.forEach(entry => {
        const parts = entry.entryName.split('/').filter(Boolean);
        if (parts.length > 0) rootFolders.add(parts[0]);
      });

      if (rootFolders.size === 0) {
        return { success: false, error: 'El archivo ZIP está vacío' };
      }
      if (rootFolders.size > 1) {
        return { success: false, error: 'El ZIP debe contener una sola carpeta de proyecto en la raíz' };
      }

      projectName = [...rootFolders][0];
      const projectDir = path.join(projectsDir, projectName);

      if (fs.existsSync(projectDir)) {
        return { success: false, error: `Ya existe un proyecto con el nombre "${projectName}"` };
      }

      // Extract to temp location first
      tempDir = path.join(projectsDir, `__temp_import_${Date.now()}`);
      fs.mkdirSync(tempDir, { recursive: true });
      zip.extractAllTo(tempDir, true);

      // Move extracted folder to projects
      const extractedProjectDir = path.join(tempDir, projectName);
      if (!fs.existsSync(extractedProjectDir)) {
        // Maybe the ZIP had files directly without a root folder
        // Check if tempDir has sprint-like folders
        const tempEntries = fs.readdirSync(tempDir, { withFileTypes: true });
        const sprintLike = tempEntries.filter(e => e.isDirectory());
        if (sprintLike.length === 0) {
          deleteDir(tempDir);
          return { success: false, error: 'No se encontraron carpetas de sprint en el ZIP' };
        }
        // Move all contents to project dir
        fs.mkdirSync(projectDir, { recursive: true });
        tempEntries.forEach(e => {
          fs.renameSync(path.join(tempDir, e.name), path.join(projectDir, e.name));
        });
      } else {
        fs.renameSync(extractedProjectDir, projectDir);
      }

      // Cleanup temp
      deleteDir(tempDir);

    } else if (type === 'folder') {
      projectName = path.basename(source);
      const projectDir = path.join(projectsDir, projectName);

      if (fs.existsSync(projectDir)) {
        return { success: false, error: `Ya existe un proyecto con el nombre "${projectName}"` };
      }

      // Evitar copiar una carpeta contenedora de la propia aplicación
      const normalizedSource = path.normalize(source).toLowerCase();
      const normalizedProjectDir = path.normalize(projectDir).toLowerCase();
      if (normalizedProjectDir.startsWith(normalizedSource) || normalizedSource.startsWith(normalizedProjectDir)) {
        return { success: false, error: 'No se puede importar la carpeta raíz de la aplicación o una de sus carpetas contenedoras' };
      }

      // Validate structure
      const entries = fs.readdirSync(source, { withFileTypes: true });
      const hasSprint = entries.some(e => e.isDirectory());
      if (!hasSprint) {
        return { success: false, error: 'La carpeta seleccionada no contiene carpetas de sprint' };
      }

      // Copy folder recursively
      fs.cpSync(source, projectDir, { recursive: true });

    } else {
      return { success: false, error: 'Tipo de importación no válido' };
    }

    // Validate imported structure
    const projectDir = path.join(projectsDir, projectName);
    const sprints = fs.readdirSync(projectDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    if (sprints.length === 0) {
      deleteDir(projectDir);
      return { success: false, error: 'El proyecto importado no contiene carpetas de sprint' };
    }

    // Count HUs per sprint
    const structure = {};
    sprints.forEach(sprint => {
      const sprintDir = path.join(projectDir, sprint);
      const hus = fs.readdirSync(sprintDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);
      structure[sprint] = hus;
    });

    return {
      success: true,
      projectName,
      sprints,
      structure
    };

  } catch (err) {
    console.error('[Import Project] error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('upload-file', async (_event, { project, sprint, huName, filePaths }) => {
  try {
    const dir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    if (!fs.existsSync(dir)) throw new Error('La carpeta HU no existe');

    for (const filePath of filePaths) {
      const fileName = path.basename(filePath);
      fs.copyFileSync(filePath, path.join(dir, fileName));
    }
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documentos', extensions: ['xlsx', 'xls', 'docx', 'doc'] }
    ]
  });
  return result.canceled ? [] : result.filePaths;
});

// ── Organizar Insumos ─────────────────────────────────────────────────────────

const MULTIMEDIA_EXTENSIONS = new Set(['.mp4', '.png', '.json']);

ipcMain.handle('organize-insumos', async (_event, { project }) => {
  try {
    const projectDir = path.join(BASE_DIR, 'projects', project);
    if (!fs.existsSync(projectDir)) {
      return { success: false, error: `El proyecto "${project}" no existe` };
    }

    const sprints = fs.readdirSync(projectDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && e.name.toLowerCase().startsWith('sprint-'))
      .map(e => e.name);

    let totalMoved = 0;
    const details = [];

    for (const sprint of sprints) {
      const sprintDir = path.join(projectDir, sprint);
      const hus = fs.readdirSync(sprintDir, { withFileTypes: true })
        .filter(e => e.isDirectory() && (e.name.startsWith('CP_') || e.name.startsWith('HU')));

      for (const hu of hus) {
        const huDir = path.join(sprintDir, hu.name);
        const insumosDir = path.join(huDir, 'Insumos');

        const multimediaFiles = fs.readdirSync(huDir)
          .filter(f => {
            if (f.startsWith('.') || f.startsWith('~$')) return false;
            const ext = path.extname(f).toLowerCase();
            if (!MULTIMEDIA_EXTENSIONS.has(ext)) return false;
            // Excluir _guide.json (metadata de audio guide)
            if (ext === '.json' && f.includes('_guide')) return false;
            return true;
          });

        if (multimediaFiles.length === 0) {
          details.push({ hu: hu.name, moved: 0 });
          continue;
        }

        fs.mkdirSync(insumosDir, { recursive: true });

        let moved = 0;
        for (const file of multimediaFiles) {
          const src = path.join(huDir, file);
          let dest = path.join(insumosDir, file);

          // Evitar sobrescritura: agregar sufijo si ya existe
          if (fs.existsSync(dest)) {
            const ext = path.extname(file);
            const base = path.basename(file, ext);
            let counter = 1;
            while (fs.existsSync(path.join(insumosDir, `${base}_${counter}${ext}`))) {
              counter++;
            }
            dest = path.join(insumosDir, `${base}_${counter}${ext}`);
          }

          try {
            fs.renameSync(src, dest);
            moved++;
          } catch (err) {
            console.error(`[Insumos] Error moviendo ${file}: ${err.message}`);
          }
        }

        totalMoved += moved;
        details.push({ hu: hu.name, moved });
      }
    }

    return { success: true, totalMoved, totalHus: details.length, details };
  } catch (err) {
    console.error('[Organize Insumos] error:', err);
    return { success: false, error: err.message };
  }
});

// ── Generar Evidencia (evidence-v2) ───────────────────────────────────────────

ipcMain.handle('generate-evidence', async (_event, { project, sprint, huId }) => {
  try {
    const args = ['evidence-v2', '--project', project];
    if (huId) {
      args.push('--hu', huId);
    } else if (sprint) {
      args.push('--sprint', sprint);
    } else {
      args.push('--all');
    }
    await runPythonCommand(args);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// ── Handlers de Generación ────────────────────────────────────────────────────

ipcMain.handle('generate-audio-guide', async (_event, { project, huId }) => {
  try {
    await runPythonCommand(['audio-guide', '--project', project, '--hu', huId, '--force']);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-audio-guide', async (_event, { project, sprint, huName, huId }) => {
  const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
  const wavPath = path.join(huDir, `${huId}_guide.wav`);
  const mdPath = path.join(huDir, `${huId}_guide.md`);
  
  if (!fs.existsSync(wavPath) || !fs.existsSync(mdPath)) {
    return { success: false, error: 'No se encontraron los archivos de audio-guía' };
  }

  // Leer guión para la UI
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  
  // Leer audio en base64 para reproducir en el renderer
  const audioBase64 = fs.readFileSync(wavPath).toString('base64');
  
  // Leer duraciones de metadata (si existen)
  let durations = [];
  try {
      const metaPath = wavPath.replace('.wav', '.json');
      if (fs.existsSync(metaPath)) {
         durations = JSON.parse(fs.readFileSync(metaPath)).durations;
      }
   } catch(e) {
      console.error("Error loading durations metadata", e);
   }

  return { success: true, mdContent, audioBase64, durations };
});

// ── Exploratory Testing IPC Handlers ──────────────────────────────────────────

ipcMain.handle('select-video-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'webm', 'mkv', 'avi', 'mov'] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('trim-video', async (_event, { inputPath, project, sprint, huName, fileName, startSec, duration }) => {
  return new Promise((resolve) => {
    try {
      const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
      if (!fs.existsSync(huDir)) {
        fs.mkdirSync(huDir, { recursive: true });
      }
      const outputPath = path.join(huDir, fileName);
      const args = [
        '-y',
        '-ss', parseFloat(startSec).toString(),
        '-i', inputPath,
        '-t', parseFloat(duration).toString(),
        '-c', 'copy',
        outputPath
      ];
      console.log('[Trim] Running ffmpeg', args.join(' '));
      const proc = spawn('ffmpeg', args);
      let stderr = '';
      proc.stderr.on('data', d => stderr += d.toString());
      proc.on('close', code => {
        if (code === 0) {
          resolve({ success: true, outputPath });
        } else {
          console.error('[Trim] ffmpeg error:', stderr);
          resolve({ success: false, error: stderr });
        }
      });
      proc.on('error', err => {
        console.error('[Trim] spawn error:', err);
        resolve({ success: false, error: err.message });
      });
    } catch (e) {
      console.error('[Trim] exception:', e);
      resolve({ success: false, error: e.message });
    }
  });
});

ipcMain.handle('save-annotated-frame', async (_event, { project, sprint, huName, base64Image, annotations, findingType, description }) => {
  try {
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    if (!fs.existsSync(huDir)) {
      fs.mkdirSync(huDir, { recursive: true });
    }
    const ts = Date.now();
    const fileName = `finding_${findingType}_${ts}`;
    const pngPath = path.join(huDir, `${fileName}.png`);
    const jsonPath = path.join(huDir, `${fileName}.json`);

    const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    fs.writeFileSync(pngPath, imageBuffer);

    const metadata = {
      findingType,
      description,
      annotations,
      generated_at: new Date().toISOString()
    };
    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));

    return { success: true, pngName: `${fileName}.png`, jsonName: `${fileName}.json` };
  } catch (err) {
    console.error('[Save Annotated Frame] error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('list-hu-evidence', async (_event, { project, sprint, huName }) => {
  try {
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    if (!fs.existsSync(huDir)) return { success: true, files: [] };

    const allFiles = fs.readdirSync(huDir);
    const evidenceFiles = allFiles.filter(f =>
      /^exploratory_.*\.mp4$/.test(f) ||
      /^finding_.*\.(png|json)$/.test(f)
    );

    const files = evidenceFiles.map(f => {
      const fullPath = path.join(huDir, f);
      const stat = fs.statSync(fullPath);
      const isVideo = f.endsWith('.mp4');
      const isScreenshot = f.endsWith('.png');
      const isMeta = f.endsWith('.json');

      // Parse type from filename: finding_bug_12345.png → bug
      let type = 'unknown';
      const matchVideo = f.match(/^exploratory_(.+)_\d+\.mp4$/);
      const matchFinding = f.match(/^finding_(.+)_\d+\.(png|json)$/);
      if (matchVideo) type = matchVideo[1];
      else if (matchFinding) type = matchFinding[1];

      // Group: match .mp4 with its .png + .json pair by timestamp
      const tsMatch = f.match(/_(\d+)\.(mp4|png|json)$/);
      const timestamp = tsMatch ? parseInt(tsMatch[1]) : 0;

      return {
        name: f,
        fullPath,
        isVideo,
        isScreenshot,
        isMeta,
        type,
        timestamp,
        size: stat.size,
        createdAt: stat.mtime.toISOString()
      };
    });

    // Group by timestamp (same trim event = same timestamp)
    const groups = {};
    files.forEach(f => {
      if (!groups[f.timestamp]) {
        groups[f.timestamp] = { timestamp: f.timestamp, type: f.type, video: null, screenshot: null, meta: null };
      }
      if (f.isVideo) groups[f.timestamp].video = f;
      else if (f.isScreenshot) groups[f.timestamp].screenshot = f;
      else if (f.isMeta) groups[f.timestamp].meta = f;
    });

    const grouped = Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);

    return { success: true, grouped };
  } catch (err) {
    console.error('[List Evidence] error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('delete-hu-evidence', async (_event, { project, sprint, huName, fileName }) => {
  try {
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    const filePath = path.join(huDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (err) {
    console.error('[Delete Evidence] error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('read-evidence-meta', async (_event, { project, sprint, huName, metaFileName }) => {
  try {
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    const jsonPath = path.join(huDir, metaFileName);
    if (!fs.existsSync(jsonPath)) return { success: false, error: 'Meta file not found' };
    const content = fs.readFileSync(jsonPath, 'utf-8');
    return { success: true, metadata: JSON.parse(content) };
  } catch (err) {
    console.error('[Read Evidence Meta] error:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('update-evidence-meta', async (_event, { project, sprint, huName, metaFileName, metadata }) => {
  try {
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    const jsonPath = path.join(huDir, metaFileName);
    fs.writeFileSync(jsonPath, JSON.stringify(metadata, null, 2));
    return { success: true };
  } catch (err) {
    console.error('[Update Evidence Meta] error:', err);
    return { success: false, error: err.message };
  }
});

// ─── Desktop Capturer ──────────────────────────────────────────────────────────
ipcMain.handle('get-screen-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });
  return sources.map(s => ({ 
    id: s.id, 
    name: s.name, 
    displayId: s.display_id,
    thumbnail: s.thumbnail.toDataURL()
  }));
});

let currentFfmpegProc = null;
let currentMp4Path = null;
let currentHuId = null;
let overlayWin = null;

function createOverlayWindow(crop, sourceId, displayId) {
  try {
    const { screen } = require('electron');
    if (overlayWin && !overlayWin.isDestroyed()) {
      overlayWin.close();
    }

    // ── 1. Resolve which physical display to place the overlay on ─────────────
    const allDisplays = screen.getAllDisplays();
    let displayBounds = screen.getPrimaryDisplay().bounds;

    if (displayId) {
      // displayId comes directly from desktopCapturer source.display_id (most reliable)
      const matched = allDisplays.find(d => String(d.id) === String(displayId));
      if (matched) {
        displayBounds = matched.bounds;
        console.log('[Overlay] Matched display by displayId:', displayId, '->', displayBounds);
      } else {
        console.warn('[Overlay] No display matched displayId:', displayId, '| Available:', allDisplays.map(d => d.id));
      }
    } else if (sourceId) {
      // Fallback: parse the numeric part from "screen:DISPLAY_ID:0"
      const parts = String(sourceId).split(':');
      const idFromSource = parts.length >= 2 ? parts[1] : null;
      if (idFromSource) {
        const matched = allDisplays.find(d => String(d.id) === idFromSource);
        if (matched) displayBounds = matched.bounds;
      }
    }
    console.log('[Overlay] Using displayBounds:', displayBounds);

    // ── 2. Map crop (in virtual resolution pixels) to real screen pixels ──────
    // crop.x / crop.y are already in real desktop pixel coordinates (passed from
    // main.js gdigrab offset_x/y which use the same coordinate space).
    // The overlay must be placed at the bottom-centre of the crop region.
    const overlayW = Math.min(700, Math.round(crop && crop.w > 0 ? crop.w : displayBounds.width));
    const overlayH = 110;

    let overlayX, overlayY;
    if (crop && crop.w > 0 && crop.h > 0) {
      // Centre horizontally in the crop region, near the bottom
      overlayX = Math.round(displayBounds.x + crop.x + (crop.w - overlayW) / 2);
      overlayY = Math.round(displayBounds.y + crop.y + crop.h - overlayH - 10);
    } else {
      // Full-screen fallback: bottom-centre of the display
      overlayX = Math.round(displayBounds.x + (displayBounds.width - overlayW) / 2);
      overlayY = Math.round(displayBounds.y + displayBounds.height - overlayH - 20);
    }

    // Clamp to display bounds so it never goes off-screen
    overlayX = Math.max(displayBounds.x, Math.min(overlayX, displayBounds.x + displayBounds.width - overlayW));
    overlayY = Math.max(displayBounds.y, Math.min(overlayY, displayBounds.y + displayBounds.height - overlayH));

    // ── 3. Create the BrowserWindow hidden first, then reposition & show ──────
    overlayWin = new BrowserWindow({
      width: overlayW,
      height: overlayH,
      x: overlayX,
      y: overlayY,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      show: false,           // <── hidden until positioned to avoid flash inside app
      focusable: true,
      resizable: true,
      minWidth: 220,
      minHeight: 90,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    overlayWin.setAlwaysOnTop(true, 'screen-saver'); // highest z-order level

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    background: transparent;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    user-select: none;
  }

  /* ── Resize handles: 8 hotspots around the border ── */
  .rz {
    position: fixed;
    z-index: 999;
    -webkit-app-region: no-drag;
  }
  /* corners */
  .rz-nw { top:0;    left:0;   width:10px; height:10px; cursor:nw-resize; }
  .rz-ne { top:0;    right:0;  width:10px; height:10px; cursor:ne-resize; }
  .rz-sw { bottom:0; left:0;   width:10px; height:10px; cursor:sw-resize; }
  .rz-se { bottom:0; right:0;  width:10px; height:10px; cursor:se-resize; }
  /* edges */
  .rz-n  { top:0;    left:10px; right:10px; height:5px;  cursor:n-resize;  }
  .rz-s  { bottom:0; left:10px; right:10px; height:5px;  cursor:s-resize;  }
  .rz-w  { top:10px; left:0;    bottom:10px; width:5px;  cursor:w-resize;  }
  .rz-e  { top:10px; right:0;   bottom:10px; width:5px;  cursor:e-resize;  }

  /* corner glow hint */
  .rz-se::after, .rz-ne::after, .rz-sw::after, .rz-nw::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 2px;
    background: rgba(88,166,255,0.25);
    transition: background 0.15s;
  }
  .rz-se:hover::after, .rz-ne:hover::after,
  .rz-sw:hover::after, .rz-nw:hover::after {
    background: rgba(88,166,255,0.55);
  }

  /* ── Main layout ── */
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 6px 8px 8px 8px;
    gap: 4px;
    -webkit-app-region: drag;
  }

  /* ── Top bar ── */
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 4px;
    -webkit-app-region: drag;
  }
  .drag-handle {
    flex: 1;
    text-align: center;
    cursor: grab;
    opacity: 0.45;
    font-size: 10px;
    color: #58a6ff;
    letter-spacing: 2px;
    -webkit-app-region: drag;
  }
  .drag-handle:active { cursor: grabbing; }

  /* font controls */
  .font-controls {
    display: flex;
    align-items: center;
    gap: 3px;
    -webkit-app-region: no-drag;
    flex-shrink: 0;
  }
  .font-btn {
    background: rgba(88,166,255,0.15);
    border: 1px solid rgba(88,166,255,0.45);
    color: #58a6ff;
    border-radius: 4px;
    width: 20px; height: 20px;
    font-size: 13px; font-weight: bold;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    transition: background 0.15s;
  }
  .font-btn:hover { background: rgba(88,166,255,0.30); }
  .font-size-label {
    color: rgba(88,166,255,0.7);
    font-size: 10px;
    min-width: 24px;
    text-align: center;
  }
  /* spacer to balance right side */
  .top-right { width: 50px; }

  /* ── Playback control buttons ── */
  .ctrl-btns {
    display: flex;
    align-items: center;
    gap: 3px;
    -webkit-app-region: no-drag;
    flex-shrink: 0;
  }
  .ctrl-btn {
    background: rgba(88,166,255,0.12);
    border: 1px solid rgba(88,166,255,0.4);
    color: rgba(88,166,255,0.75);
    border-radius: 4px;
    width: 24px; height: 24px;
    font-size: 11px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 0;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    -webkit-app-region: no-drag;
  }
  .ctrl-btn:hover {
    background: rgba(88,166,255,0.28);
    color: #58a6ff;
  }
  .ctrl-btn.active {
    background: rgba(88,166,255,0.25);
    color: #58a6ff;
    box-shadow: 0 0 6px rgba(88,166,255,0.5);
    border-color: #58a6ff;
  }
  .ctrl-btn.stop { color: rgba(255,80,80,0.7); border-color: rgba(255,80,80,0.35); background: rgba(255,80,80,0.08); }
  .ctrl-btn.stop:hover { color: #ff5050; background: rgba(255,80,80,0.22); box-shadow: 0 0 6px rgba(255,80,80,0.4); border-color: #ff5050; }

  /* ── Text bubble ── */
  #text {
    flex: 1;
    background: rgba(13, 17, 23, 0.72);
    color: #58a6ff;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 14px;
    border-radius: 8px;
    border: 2px solid rgba(88,166,255,0.75);
    text-align: left;
    overflow-y: auto;
    box-shadow: 0 0 16px rgba(88,166,255,0.5);
    word-wrap: break-word;
    line-height: 1.45;
    -webkit-app-region: no-drag;
    cursor: default;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  #text::-webkit-scrollbar { width: 4px; }
  #text::-webkit-scrollbar-thumb { background: rgba(88,166,255,0.4); border-radius:2px; }
</style>
</head>
<body>
  <!-- 8 resize handles -->
  <div class="rz rz-nw" data-dir="nw"></div>
  <div class="rz rz-ne" data-dir="ne"></div>
  <div class="rz rz-sw" data-dir="sw"></div>
  <div class="rz rz-se" data-dir="se"></div>
  <div class="rz rz-n"  data-dir="n" ></div>
  <div class="rz rz-s"  data-dir="s" ></div>
  <div class="rz rz-w"  data-dir="w" ></div>
  <div class="rz rz-e"  data-dir="e" ></div>

  <div class="container">
    <div class="top-bar">
      <!-- Font size controls -->
      <div class="font-controls">
        <button class="font-btn" id="btn-smaller" title="Decrease font size">-</button>
        <span class="font-size-label" id="size-label">14</span>
        <button class="font-btn" id="btn-larger"  title="Increase font size">+</button>
      </div>
      <!-- Drag handle centre -->
      <div class="drag-handle">⠿⠿ DRAG ⠿⠿</div>
      <!-- Playback controls -->
      <div class="ctrl-btns">
        <button class="ctrl-btn play"  id="btn-play"  title="Play">&#9654;</button>
        <button class="ctrl-btn pause" id="btn-pause" title="Pause">&#9646;&#9646;</button>
        <button class="ctrl-btn stop"  id="btn-stop"  title="Stop">&#9646;</button>
      </div>
    </div>
    <div id="text">● Grabando...</div>
  </div>

  <script>
    const { ipcRenderer } = require('electron');
    const textEl   = document.getElementById('text');
    const sizeLabel = document.getElementById('size-label');
    let fontSize = 14;
    let isPaused = false;

    /* ── Font size ── */
    function setFontSize(s) {
      fontSize = Math.max(10, Math.min(32, s));
      textEl.style.fontSize = fontSize + 'px';
      sizeLabel.textContent = fontSize;
    }
    document.getElementById('btn-smaller').addEventListener('click', () => setFontSize(fontSize - 1));
    document.getElementById('btn-larger').addEventListener('click',  () => setFontSize(fontSize + 1));

    /* ── Playback controls ── */
    const btnPlay  = document.getElementById('btn-play');
    const btnPause = document.getElementById('btn-pause');
    const btnStop  = document.getElementById('btn-stop');

    btnPlay.addEventListener('click', () => {
      ipcRenderer.send('overlay-control', 'play');
      btnPlay.classList.add('active');
      btnPause.classList.remove('active');
    });
    btnPause.addEventListener('click', () => {
      isPaused = !isPaused;
      ipcRenderer.send('overlay-control', isPaused ? 'pause' : 'resume');
      btnPause.classList.toggle('active', isPaused);
      btnPlay.classList.toggle('active', !isPaused);
    });
    btnStop.addEventListener('click', () => {
      ipcRenderer.send('overlay-control', 'stop');
      btnPlay.classList.remove('active');
      btnPause.classList.remove('active');
    });

    /* ── IPC text update — also sync pause button state ── */
    ipcRenderer.on('update-overlay-text', (_e, text) => {
      textEl.innerText = text;
      // When new text arrives audio is playing
      isPaused = false;
      btnPlay.classList.add('active');
      btnPause.classList.remove('active');
    });

    ipcRenderer.on('overlay-sync-state', (_e, state) => {
      isPaused = state === 'paused';
      btnPause.classList.toggle('active', isPaused);
      btnPlay.classList.toggle('active', !isPaused);
    });

    /* ── Resize via IPC ── */
    const MIN_W = 220, MIN_H = 90;
    let resizing = false;
    let resizeDir = null;
    let startX, startY, startBounds;

    document.querySelectorAll('.rz').forEach(handle => {
      handle.addEventListener('mousedown', e => {
        e.preventDefault();
        resizing  = true;
        resizeDir = handle.dataset.dir;
        startX    = e.screenX;
        startY    = e.screenY;
        // Ask main for current bounds
        ipcRenderer.invoke('overlay-get-bounds').then(b => { startBounds = b; });
      });
    });

    document.addEventListener('mousemove', e => {
      if (!resizing || !startBounds) return;
      const dx = e.screenX - startX;
      const dy = e.screenY - startY;
      let { x, y, width, height } = startBounds;

      if (resizeDir.includes('e')) width  = Math.max(MIN_W, width  + dx);
      if (resizeDir.includes('s')) height = Math.max(MIN_H, height + dy);
      if (resizeDir.includes('w')) { const nw = Math.max(MIN_W, width - dx);  x += width - nw;  width = nw; }
      if (resizeDir.includes('n')) { const nh = Math.max(MIN_H, height - dy); y += height - nh; height = nh; }

      ipcRenderer.invoke('overlay-set-bounds', { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) });
    });

    document.addEventListener('mouseup', () => { resizing = false; startBounds = null; });
  </script>
</body>
</html>`;

    overlayWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

    // Show only after content loads to avoid flash
    overlayWin.webContents.once('did-finish-load', () => {
      if (overlayWin && !overlayWin.isDestroyed()) {
        overlayWin.showInactive(); // show without stealing focus
      }
    });

  } catch (e) {
    console.error('Error creating overlay window:', e);
  }
}

function closeOverlayWindow() {
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.close();
  }
  overlayWin = null;
}

ipcMain.handle('update-overlay-text', async (_event, text) => {
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.webContents.send('update-overlay-text', text);
  }
  return { success: true };
});

ipcMain.handle('overlay-get-bounds', async () => {
  if (overlayWin && !overlayWin.isDestroyed()) {
    return overlayWin.getBounds();
  }
  return null;
});

ipcMain.handle('overlay-set-bounds', async (_event, { x, y, width, height }) => {
  if (overlayWin && !overlayWin.isDestroyed()) {
    overlayWin.setBounds({ x, y, width, height }, false);
  }
  return { success: true };
});

// Forward play/pause/stop from overlay to the main app renderer
ipcMain.on('overlay-control', (_event, action) => {
  if (appWin && !appWin.isDestroyed()) {
    appWin.webContents.send('overlay-control', action);
  }
});

ipcMain.handle('start-recording', async (_event, { project, sprint, huName, huId, crop, sourceId, displayId }) => {
  try {
    createOverlayWindow(crop, sourceId, displayId);
    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    const ts = Date.now();
    const finalName = `evidence_${huId}_${ts}`;
    currentMp4Path = path.join(huDir, `${finalName}.mp4`);
    currentHuId = huId;

    let ffmpegArgs = ['-y'];

    if (crop && crop.w > 0 && crop.h > 0) {
      ffmpegArgs.push('-offset_x', Math.round(crop.x).toString(), '-offset_y', Math.round(crop.y).toString(), '-video_size', `${Math.round(crop.w)}x${Math.round(crop.h)}`);
    }

    if (isWindows) {
      ffmpegArgs.push('-framerate', '15', '-f', 'gdigrab', '-i', 'desktop');
    } else {
      const display = process.env.DISPLAY || ':0.0';
      ffmpegArgs.push('-framerate', '15', '-f', 'x11grab', '-i', display);
    }
    ffmpegArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23');
    ffmpegArgs.push('-movflags', '+faststart', currentMp4Path);

    currentFfmpegProc = spawn('ffmpeg', ffmpegArgs);
    currentFfmpegProc.on('error', (err) => console.error('FFmpeg error', err));
    return { success: true };
  } catch (err) {
    closeOverlayWindow();
    return { success: false, error: err.message };
  }
});

ipcMain.handle('save-recording', async (_event, { project, sprint, huName, huId, cps, timestamps, audioBuffer }) => {
  try {
    closeOverlayWindow();
    if (currentFfmpegProc) {
      currentFfmpegProc.stdin.write('q\n');
      await new Promise(r => currentFfmpegProc.on('close', r));
      currentFfmpegProc = null;
    }

    const huDir = path.join(BASE_DIR, 'projects', project, sprint, huName);
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const finalMp4Path = currentMp4Path.replace('.mp4', '_muxed.mp4');
    const rawAudioPath = path.join(huDir, `audio_live_${ts}.webm`);
    const fileLabel = path.basename(finalMp4Path);
    const jsonPath = path.join(huDir, `trazabilidad_${huId}_${ts}.json`);

    // Guardar audio dinámico y mezclar (si existe audio)
    if (audioBuffer && audioBuffer.length > 0) {
      fs.writeFileSync(rawAudioPath, Buffer.from(audioBuffer));
      await new Promise((resolve, reject) => {
        const ff = spawn('ffmpeg', [
          '-y', '-i', currentMp4Path, '-i', rawAudioPath, 
          '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', 
          finalMp4Path
        ]);
        ff.on('close', code => code === 0 ? resolve() : reject(new Error('Muxing failed')));
      });
      if (fs.existsSync(rawAudioPath)) fs.unlinkSync(rawAudioPath);
    } else {
      fs.copyFileSync(currentMp4Path, finalMp4Path);
    }

    if (fs.existsSync(currentMp4Path)) fs.unlinkSync(currentMp4Path);

    const huTimestamps = {};
    cps.forEach(cp => huTimestamps[cp.id] = [cp.startSec, cp.endSec]);

    const trazabilidad = {
      [huId]: huTimestamps,
      _meta: { video_file: fileLabel, video_duration_sec: timestamps.duration || 0, generated_at: new Date().toISOString() }
    };
    
    fs.writeFileSync(jsonPath, JSON.stringify(trazabilidad, null, 2));

    const mainTraz = path.join(BASE_DIR, 'config', 'trazabilidad.json');
    if (fs.existsSync(mainTraz)) {
      try {
        const ext = JSON.parse(fs.readFileSync(mainTraz));
        ext[huId] = huTimestamps;
        fs.writeFileSync(mainTraz, JSON.stringify(ext, null, 2));
      } catch (e) { console.error('Error config', e); }
    }

    return { success: true, videoFile: fileLabel, mp4Path: finalMp4Path };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
// ── App Lifecycle ─────────────────────────────────────────────────────────────

let appWin = null;

function createWindow() {
  nativeTheme.themeSource = 'dark';
  const winOptions = {
    width: 1200,
    height: 850,
    backgroundColor: '#0d1117',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Automatic test case — Screen Recorder Sincronizado',
  };

  if (process.platform === 'win32') {
    winOptions.titleBarStyle = 'hidden';
    winOptions.titleBarOverlay = {
      color: '#070a0e',
      symbolColor: '#c9d1d9',
      height: 32
    };
  }

  const win = new BrowserWindow(winOptions);

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.removeMenu();
  appWin = win;

  // ── Destroy overlay when the main window is closed ──────────────────────────
  win.on('close', () => {
    closeOverlayWindow();
    if (currentFfmpegProc) {
      try { currentFfmpegProc.stdin.write('q\n'); } catch(e) {}
      currentFfmpegProc = null;
    }
  });
}

app.whenReady().then(() => {
  // Conceder permisos absolutos a WebRTC y DesktopCapturer
  session.defaultSession.setPermissionCheckHandler(() => true);
  session.defaultSession.setPermissionRequestHandler((wc, permission, callback) => {
    callback(true);
  });
  try {
    session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
      desktopCapturer.getSources({ types: ['screen'] }).then((sources) => {
        callback({ video: sources[0], audio: 'loopback' });
      }).catch(err => console.error(err));
    });
  } catch (e) {
    console.error('Error setting DisplayMediaRequestHandler', e);
  }

  createWindow();
});
app.on('window-all-closed', () => {
  closeOverlayWindow();          // always destroy floating overlay on quit
  if (process.platform !== 'darwin') app.quit();
});

// Safety net: destroy overlay before any quit path
app.on('before-quit', () => {
  closeOverlayWindow();
});

app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
