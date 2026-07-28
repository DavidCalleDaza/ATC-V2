// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  en: {
    "app-title": "Automatic test case",
    "app-subtitle": "Synchronized Evidence Recorder",
    "lang-label": "Language:",
    "phase0-title": "0. Projects Dashboard",
    "col-projects": "Projects <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-projects": "Project Detail",
    "col-sprints": "Sprints <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-sprints": "Sprint Detail",
    "col-hus": "User Stories <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-hus": "User Story Detail",
    "col-cps": "Test Cases <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "status-select-project": "Select a project...",
    "status-select-sprint": "Select a sprint...",
    "status-no-hus": "No User Stories in this sprint.",
    "status-excel-label": "Design Excel:",
    "status-word-label": "Word Template:",
    "status-audio-label": "Audio Guide:",
    "status-found": `${iconCheck(12)} File OK`,
    "status-missing": "Missing",
    "status-generated": `${iconCheck(12)} Generated`,
    "btn-upload": "Attach / Upload Files",
    "btn-start-flow": "➜ Go to Record Evidences",
    "phase1-title": "1. Prepare Audio Guide",
    "audio-missing-title": "Missing Audio Guide",
    "audio-missing-text": "The audio and script for this HU have not been generated.",
    "audio-ready-title": "Audio Guide Ready",
    "audio-ready-text": "Script loaded successfully. You can proceed to select the recording region.",
    "btn-back": "Back",
    "btn-generate-audio": "Generate Audio with Python",
    "btn-regenerate-audio": "Regenerate Audio (Force)",
    "btn-go-region": "Next: Select Region",
    "phase2-title": "2. Select Region to Record",
    "phase2-desc": "Select the screen you wish to record and adjust the frame over the exact region that will be captured in the video.",
    "screen-label": "Screen/Window:",
    "screen-loading": "Loading sources...",
    "btn-start-recording": "Start Recording",
    "phase3-title": "3. Recording ",
    "btn-play-all": "▶ Play All Continuous",
    "btn-pause-audio": "Pause Audio",
    "btn-resume-audio": "Resume Audio",
    "btn-stop-recording": "Stop Recording",
    "btn-discard-recording": "Discard",
    "script-ref-title": "Reference Script",
    "script-ref-wait": "Waiting... Select a block from the list to narrate.",
    "voice-speed": "Voice Speed:",
    "phase4-title": "4. Recording Finished",
    "btn-back-home": "Back to Home",
    "saving-video": "Processing video (Saving traceability and finishing recording...)",
    "save-success": "Video Recorded Successfully",
    "save-error": "Error in processing",
    "confirm-delete-project": "Are you sure you want to delete project \"{name}\"?",
    "confirm-delete-sprint": "Are you sure you want to delete sprint \"{name}\"?",
    "confirm-delete-hu": "Are you sure you want to delete User Story \"{name}\"?",
    "modal-rename-project": "Rename Project",
    "modal-rename-sprint": "Rename Sprint",
    "modal-rename-hu": "Rename User Story",
    "modal-new-project": "New Project",
    "modal-new-sprint": "New Sprint",
    "modal-new-hu": "New User Story",
    "input-placeholder-name": "Enter name...",
    "window-title": "Automatic test case — Evidence Recorder",
    "btn-exploratory": `${iconSearch(16)} Exploratory Testing`,
    "btn-parse-excel": `${iconClipboard(16)} Parse Excel`,
    "btn-organize-insumos": `${iconPackage(16)} Organize Supplies`,
    "btn-generate-evidence": `${iconDocument(16)} Generate Evidence`,
    "phase-exploratory-title": "Exploratory Testing Workspace",
    "exp-project": "Project",
    "exp-sprint": "Sprint",
    "exp-drag-desc": "Drag exploratory video here or click to browse",
    "exp-select-btn": "Browse Video",
    "exp-canvas-help": "Drag on screen to draw highlights/annotated areas",
    "exp-trim-start": "Trim Start:",
    "exp-trim-end": "Trim End:",
    "exp-set-btn": "Set Current",
    "exp-add-annotation": "New Highlight Annotation",
    "exp-annotations-list": "Marked Elements",
    "exp-clear-btn": "Clear All",
    "exp-no-annotations": "No marked elements yet. Draw on video to add.",
    "exp-btn-trim": `${iconScissors(16)} Trim & Save Segment`,
    "exp-btn-frame": `${iconCamera(16)} Save Annotated Screenshot`,
    "exp-save-title": "Save Exploratory Evidence",
    "exp-save-hu": "Select Destination User Story (HU)",
    "exp-new-hu-label": "Create New User Story (HU)",
    "exp-speed-label": "Speed:",
    "import-choice-title": "Import Project",
    "import-choice-desc": "How would you like to import the project?",
    "import-zip-btn": "ZIP Archive (physical compressed file)",
    "import-folder-btn": "System Folder (physical folder directory)",
    "cp-table-id": "CP ID",
    "cp-table-name": "Test Case Name",
    "cp-table-result": "Expected Result",
    "cp-table-type": "Type",
    "cp-positive": "Positive",
    "cp-negative": "Negative",
    "cp-no-data": "No test cases parsed. Click 'Parse Excel' first.",
    "cp-no-hu": "Select a User Story to view its test cases.",
    "cp-edit-title": "Edit Test Case",
    "cp-delete-confirm": "Are you sure you want to delete test case \"{name}\"?",
    "cp-detail-title": "Test Case Detail",
    "cp-detail-back": "Back to list",
    "cp-detail-resumen": "Summary:",
    "cp-detail-precondiciones": "Preconditions:",
    "cp-detail-pasos": "Steps:",
    "cp-detail-resultado": "Expected Result:",
    "cp-detail-contexto": "Context:",
    "detail-summary": "Summary",
    "detail-last-modified": "Last Modified",
    "detail-total-sprints": "Total Sprints",
    "detail-total-hus": "Total User Stories",
    "detail-total-cps": "Total Test Cases",
    "detail-positive-cps": "Positive",
    "detail-negative-cps": "Negative",
    "detail-audio-guides": "Audio Guides",
    "detail-word-evidence": "Word Evidence",
    "detail-excel-files": "Excel Files",
    "detail-sprint-breakdown": "Sprint Breakdown",
    "detail-hu-list": "User Stories",
    "detail-cps": "CPs",
    "detail-audio": "Audio",
    "detail-word": "Word",
    "detail-folder-path": "Folder Path",
    "detail-file-count": "Total Files",
    "detail-evidence-count": "Evidence Files",
    "detail-trazabilidad": "Traceability",
    "detail-traced": "mapped",
    "detail-excel-size": "Excel Size",
    "detail-word-size": "Word Size",
    "detail-audio-duration": "Audio Duration",
    "detail-audio-size": "Audio Size",
    "detail-insumos": "Supplies Folder",
    "detail-evidence-videos": "Videos",
    "detail-evidence-screenshots": "Screenshots",
    "detail-evidence-findings": "Findings",
    "detail-parent-hu": "Parent HU",
    "detail-linked-files": "Linked Files",
    "detail-trazabilidad-video": "Video Timestamps",
    "detail-no-trazabilidad": "No traceability recorded",
    "detail-na": "N/A",
  },
  es: {
    "app-title": "Automatización de casos de prueba",
    "app-subtitle": "Grabador Sincronizado de Evidencias",
    "lang-label": "Idioma:",
    "phase0-title": "0. Dashboard de Proyectos",
    "col-projects": "Proyectos <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-projects": "Detalle Proyectos",
    "col-sprints": "Sprints <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-sprints": "Detalle Sprints",
    "col-hus": "Historias de Usuario <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "detail-title-hus": "Detalle Historias de Usuario",
    "col-cps": "Casos de Prueba <span class=\"col-v-collapse-icon\">—</span> <span class=\"col-collapse-icon\">│</span>",
    "status-select-project": "Selecciona un proyecto...",
    "status-select-sprint": "Selecciona un sprint...",
    "status-no-hus": "No hay HUs en este sprint.",
    "status-excel-label": "Excel de Diseño:",
    "status-word-label": "Word Plantilla:",
    "status-audio-label": "Audio-Guía:",
    "status-found": `${iconCheck(12)} Archivo OK`,
    "status-missing": "Falta",
    "status-generated": `${iconCheck(12)} Generado`,
    "btn-upload": "Adjuntar / Subir Archivos",
    "btn-start-flow": "➜ Ir a Grabar Evidencias",
    "phase1-title": "1. Preparar Audio-Guía",
    "audio-missing-title": "Falta Audio-Guía",
    "audio-missing-text": "El audio y guión para esta HU no han sido generados.",
    "audio-ready-title": "Audio-Guía Lista",
    "audio-ready-text": "Guión cargado correctamente. Puedes avanzar a seleccionar la región de grabación.",
    "btn-back": "Volver",
    "btn-generate-audio": "Generar Audio con Python",
    "btn-regenerate-audio": "Regenerar Audio (Forzar)",
    "btn-go-region": "Siguiente: Seleccionar Región",
    "phase2-title": "2. Seleccionar Región a Grabar",
    "phase2-desc": "Selecciona la pantalla que deseas grabar y ajusta el recuadro sobre la región exacta que será capturada en el video.",
    "screen-label": "Pantalla/Ventana:",
    "screen-loading": "Cargando fuentes...",
    "btn-start-recording": "Iniciar Grabación",
    "phase3-title": "3. Grabando ",
    "btn-play-all": "▶ Reproducir Todo Continuo",
    "btn-pause-audio": "Pausar Audio",
    "btn-resume-audio": "Reanudar Audio",
    "btn-stop-recording": "Detener Grabación",
    "btn-discard-recording": "Descartar",
    "script-ref-title": "Guión de Referencia",
    "script-ref-wait": "Esperando... Selecciona un bloque de la lista para narrarlo.",
    "voice-speed": "Velocidad de Voz:",
    "phase4-title": "4. Grabación Finalizada",
    "btn-back-home": "Volver al Inicio",
    "saving-video": "Procesando video (Guardando trazabilidad y finalizando grabación...)",
    "save-success": "Video Grabado Correctamente",
    "save-error": "Error en el procesamiento",
    "confirm-delete-project": "¿Estás seguro de que deseas eliminar el proyecto \"{name}\"?",
    "confirm-delete-sprint": "¿Estás seguro de que deseas eliminar el sprint \"{name}\"?",
    "confirm-delete-hu": "¿Estás seguro de que deseas eliminar la Historia de Usuario \"{name}\"?",
    "modal-rename-project": "Renombrar Proyecto",
    "modal-rename-sprint": "Renombrar Sprint",
    "modal-rename-hu": "Renombrar Historia de Usuario",
    "modal-new-project": "Nuevo Proyecto",
    "modal-new-sprint": "Nuevo Sprint",
    "modal-new-hu": "Nueva Historia (HU)",
    "input-placeholder-name": "Escribe aquí...",
    "window-title": "Automatic test case — Grabador de Evidencias",
    "btn-exploratory": `${iconSearch(16)} Pruebas Exploratorias`,
    "btn-parse-excel": `${iconClipboard(16)} Parsear Excel`,
    "btn-organize-insumos": `${iconPackage(16)} Organizar Insumos`,
    "btn-generate-evidence": `${iconDocument(16)} Generar Evidencia`,
    "phase-exploratory-title": "Espacio de Trabajo de Pruebas Exploratorias",
    "exp-project": "Proyecto",
    "exp-sprint": "Sprint",
    "exp-drag-desc": "Arrastra el video exploratorio aquí o haz clic para buscarlo",
    "exp-select-btn": "Buscar Video",
    "exp-canvas-help": "Arrastra sobre la pantalla para dibujar marcas/anotaciones",
    "exp-trim-start": "Inicio Recorte:",
    "exp-trim-end": "Fin Recorte:",
    "exp-set-btn": "Fijar Actual",
    "exp-add-annotation": "Nueva Anotación Destacada",
    "exp-annotations-list": "Elementos Marcados",
    "exp-clear-btn": "Limpiar Todo",
    "exp-no-annotations": "No hay elementos marcados aún. Dibuja sobre el video para agregar.",
    "exp-btn-trim": `${iconScissors(16)} Recortar y Guardar Segmento`,
    "exp-btn-frame": `${iconCamera(16)} Guardar Captura Anotada`,
    "exp-save-title": "Guardar Evidencia Exploratoria",
    "exp-save-hu": "Selecciona Historia de Usuario (HU) Destino",
    "exp-new-hu-label": "Crear Nueva Historia de Usuario (HU)",
    "exp-save-desc": "Descripción de Observaciones",
    "exp-speed-label": "Velocidad:",
    "import-choice-title": "Importar Proyecto",
    "import-choice-desc": "¿Cómo desea importar el proyecto?",
    "import-zip-btn": "Archivo ZIP (comprimido físico)",
    "import-folder-btn": "Carpeta del sistema (directorio físico)",
    "cp-table-id": "ID CP",
    "cp-table-name": "Nombre del Caso de Prueba",
    "cp-table-result": "Resultado Esperado",
    "cp-table-type": "Tipo",
    "cp-positive": "Positivo",
    "cp-negative": "Negativo",
    "cp-no-data": "No hay CPs parseados. Haz clic en 'Parsear Excel' primero.",
    "cp-no-hu": "Selecciona una Historia de Usuario para ver sus casos de prueba.",
    "cp-edit-title": "Editar Caso de Prueba",
    "cp-delete-confirm": "¿Estás seguro de que deseas eliminar el caso de prueba \"{name}\"?",
    "cp-detail-title": "Detalle caso de prueba",
    "cp-detail-back": "Volver a la lista",
    "cp-detail-resumen": "Resumen:",
    "cp-detail-precondiciones": "Precondiciones:",
    "cp-detail-pasos": "Pasos:",
    "cp-detail-resultado": "Resultado Esperado:",
    "cp-detail-contexto": "Contexto:",
    "detail-summary": "Resumen",
    "detail-last-modified": "Última Modificación",
    "detail-total-sprints": "Total Sprints",
    "detail-total-hus": "Total Historias de Usuario",
    "detail-total-cps": "Total Casos de Prueba",
    "detail-positive-cps": "Positivos",
    "detail-negative-cps": "Negativos",
    "detail-audio-guides": "Audio-Guías",
    "detail-word-evidence": "Evidencia Word",
    "detail-excel-files": "Archivos Excel",
    "detail-sprint-breakdown": "Desglose por Sprint",
    "detail-hu-list": "Historias de Usuario",
    "detail-cps": "CPs",
    "detail-audio": "Audio",
    "detail-word": "Word",
    "detail-folder-path": "Ruta de Carpeta",
    "detail-file-count": "Total Archivos",
    "detail-evidence-count": "Archivos de Evidencia",
    "detail-trazabilidad": "Trazabilidad",
    "detail-traced": "mapeados",
    "detail-excel-size": "Tamaño Excel",
    "detail-word-size": "Tamaño Word",
    "detail-audio-duration": "Duración Audio",
    "detail-audio-size": "Tamaño Audio",
    "detail-insumos": "Carpeta de Insumos",
    "detail-evidence-videos": "Videos",
    "detail-evidence-screenshots": "Capturas",
    "detail-evidence-findings": "Hallazgos",
    "detail-parent-hu": "HU Padre",
    "detail-linked-files": "Archivos Vinculados",
    "detail-trazabilidad-video": "Marcas de Video",
    "detail-no-trazabilidad": "Sin trazabilidad registrada",
    "detail-na": "N/D",
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function applyTranslations() {
  const t = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.innerHTML = t[key];
    }
  });

  const mInput = document.getElementById('modal-input');
  if (mInput) {
    mInput.placeholder = t['input-placeholder-name'];
  }
}

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  project: null,
  sprint: null,
  hus: [],
  selectedHu: null,
  selectedCp: null,
  parsedTestCases: null,
  drawerType: null,
  drawerItem: null,
  mdContent: null,
  audioBase64: null,
  screenSources: [],
  selectedSourceId: null,
  selectedDisplayId: null,
  
  crop: { x: 0, y: 0, w: 0, h: 0 },
  
  isRecording: false,
  recordingStartTime: 0,
  timerInterval: null,
  elapsedTimeBeforePause: 0,
  cpTimestamps: [],
  
  audioContext: null,
  audioBuffer: null,
  audioSource: null,
  audioDestination: null,
  playbackSpeed: 0.9,
  
  mediaStream: null,
  videoTrack: null,
  mediaRecorder: null,
  recordedChunks: [],
};

// ─── DOM refs ────────────────────────────────────────────────────────────────

// ─── Detached Window Detection ──────────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const detachedView = urlParams.get('detached');
const isDetachedWindow = !!detachedView;
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const phases = {
  dashboard: $('#phase-dashboard-layout'),
  review: $('#phase-review'),
  region: $('#phase-region'),
  recording: $('#phase-recording'),
  done: $('#phase-done'),
  exploratory: $('#phase-exploratory'),
};

function showPhase(name) {
  const isExplorer = name === 'exploratory';

  // Non-tab phases: always hide first
  ['review', 'region', 'recording', 'done'].forEach(k => {
    if (phases[k]) phases[k].classList.add('hidden');
  });

  // Dashboard vs Explorer: mutually exclusive tab content
  phases.dashboard.classList.toggle('hidden', isExplorer);
  phases.exploratory.classList.toggle('hidden', !isExplorer);

  // Update tab bar
  $('#tab-dashboard').classList.toggle('active', !isExplorer);
  $('#tab-explorer').classList.toggle('active', isExplorer);
  if (isExplorer) {
    $('#tab-explorer').classList.remove('hidden');
  }

  if (name === 'dashboard') {
    $('#sidebar-hu-details').classList.add('hidden');
  }
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Drawer helpers (open/close + compact mode toggle) ──────────────────────
function openDrawer() {
  $('#right-drawer').classList.add('open');
  const grid = $('.dashboard-grid');
  if (grid) grid.classList.add('drawer-open');
}
function closeDrawer() {
  $('#right-drawer').classList.remove('open');
  const grid = $('.dashboard-grid');
  if (grid) grid.classList.remove('drawer-open');
}

// ─── Phase 0: Dashboard (Proyectos, Sprints, HUs) ────────────────────────────

async function renderProjects() {
  const projects = await window.api.getProjects();
  const savedOrder = JSON.parse(localStorage.getItem('projectsOrder') || '[]');
  if (savedOrder.length > 0) {
    projects.sort((a, b) => {
      let idxA = savedOrder.indexOf(a);
      let idxB = savedOrder.indexOf(b);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }

  const list = $('#dash-projects-list');
  list.innerHTML = '';
  
  if (projects.length === 0) {
    list.innerHTML = `<span style="font-size: 13px; color: #8b949e;">${translations[currentLang]['status-select-project']}</span>`;
  }
  
  projects.forEach(p => {
    const el = document.createElement('div');
    el.className = `dash-item ${state.project === p ? 'active' : ''}`;
    el.dataset.name = p;
    el.setAttribute('draggable', 'true');
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = p;
    el.appendChild(labelSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '5px';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-icon edit';
    btnEdit.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>';
    btnEdit.title = translations[currentLang]['modal-rename-project'];
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      openModal(translations[currentLang]['modal-rename-project'], p, async (val) => {
        const res = await window.api.renameProject({ oldName: p, newName: val });
        if (res.success) {
          if (state.project === p) state.project = val;
          renderProjects();
        } else {
          alert('Error: ' + res.error);
        }
      });
    };

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-icon delete';
    btnDelete.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
    btnDelete.title = 'Delete';
    btnDelete.onclick = (e) => {
      e.stopPropagation();
      const confText = translations[currentLang]['confirm-delete-project'].replace('{name}', p);
      openConfirmModal(translations[currentLang]['col-projects'], confText, () => {
        window.api.deleteProject(p).then((res) => {
          if (res.success) {
            if (state.project === p) {
              state.project = null;
              state.sprint = null;
              state.selectedHu = null;
            }
            renderProjects();
            renderSprints();
            renderHus();
          } else {
            alert('Error: ' + res.error);
          }
        });
      });
    };

    const btnView = document.createElement('button');
    btnView.className = 'btn-icon view';
    
    const isDrawerOpen = $('#right-drawer').classList.contains('open');
    const isProjectActive = isDrawerOpen && state.drawerType === 'project' && state.drawerItem === p;
    if (isProjectActive) {
      btnView.classList.add('active');
      btnView.style.color = 'var(--accent-color)';
    }
    
    btnView.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    btnView.title = 'View Details';
    btnView.onclick = (e) => {
      e.stopPropagation();
      const currentlyOpen = $('#right-drawer').classList.contains('open');
      const isSameProject = state.drawerType === 'project' && state.drawerItem === p;
      
      if (currentlyOpen && isSameProject) {
        closeDrawer();
        state.drawerType = null;
        state.drawerItem = null;
        renderProjects();
      } else {
        state.drawerType = 'project';
        state.drawerItem = p;
        showProjectDetails(p);
        openDrawer();
        renderProjects();
        renderSprints();
        renderHus();
      }
    };

    el.appendChild(btnView);
    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);
    el.appendChild(actionsDiv);

    el.onclick = () => {
      state.project = p; state.sprint = null; state.selectedHu = null;
      renderProjects(); renderSprints(); renderHus();
    };
    list.appendChild(el);
  });

  $('#btn-add-sprint').classList.toggle('hidden', !state.project);
  $('#btn-export-project').classList.toggle('hidden', !state.project);
  $('#btn-export-sprint').classList.toggle('hidden', !state.project);
  $('#btn-organize-insumos').classList.toggle('hidden', !state.project);
  $('#btn-generate-evidence').classList.toggle('hidden', !state.project);
  $('#btn-parse-excel').classList.toggle('hidden', !state.sprint);
  makeSortable('dash-projects-list', 'project', (newOrder) => {
    localStorage.setItem('projectsOrder', JSON.stringify(newOrder));
  });
}

async function renderSprints() {
  const list = $('#dash-sprints-list');
  if (!state.project) { 
    list.innerHTML = translations[currentLang]['status-select-project']; 
    $('#btn-upload-files').classList.add('hidden');
    $('#btn-start-flow').classList.add('hidden');
    return; 
  }
  
  const sprints = await window.api.getSprints(state.project);
  const savedOrder = JSON.parse(localStorage.getItem('sprintsOrder_' + state.project) || '[]');
  if (savedOrder.length > 0) {
    sprints.sort((a, b) => {
      let idxA = savedOrder.indexOf(a);
      let idxB = savedOrder.indexOf(b);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }
  list.innerHTML = '';
  
  if (sprints.length === 0) {
    list.innerHTML = `<span style="font-size: 13px; color: #8b949e;">${translations[currentLang]['status-select-sprint']}</span>`;
  }
  
  sprints.forEach(s => {
    const el = document.createElement('div');
    el.className = `dash-item ${state.sprint === s ? 'active' : ''}`;
    el.dataset.name = s;
    el.setAttribute('draggable', 'true');
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = s;
    el.appendChild(labelSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '5px';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-icon edit';
    btnEdit.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>';
    btnEdit.title = translations[currentLang]['modal-rename-sprint'];
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      openModal(translations[currentLang]['modal-rename-sprint'], s, async (val) => {
        const res = await window.api.renameSprint({ project: state.project, oldName: s, newName: val });
        if (res.success) {
          if (state.sprint === s) state.sprint = val;
          renderSprints();
        } else {
          alert('Error: ' + res.error);
        }
      });
    };

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-icon delete';
    btnDelete.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
    btnDelete.title = 'Delete';
    btnDelete.onclick = (e) => {
      e.stopPropagation();
      const confText = translations[currentLang]['confirm-delete-sprint'].replace('{name}', s);
      openConfirmModal(translations[currentLang]['col-sprints'], confText, () => {
        window.api.deleteSprint({ project: state.project, sprintName: s }).then((res) => {
          if (res.success) {
            if (state.sprint === s) {
              state.sprint = null;
              state.selectedHu = null;
            }
            renderSprints();
            renderHus();
          } else {
            alert('Error: ' + res.error);
          }
        });
      });
    };

    const btnView = document.createElement('button');
    btnView.className = 'btn-icon view';
    
    const isDrawerOpen = $('#right-drawer').classList.contains('open');
    const isSprintActive = isDrawerOpen && state.drawerType === 'sprint' && state.drawerItem === s;
    if (isSprintActive) {
      btnView.classList.add('active');
      btnView.style.color = 'var(--accent-color)';
    }
    
    btnView.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    btnView.title = 'View Details';
    btnView.onclick = (e) => {
      e.stopPropagation();
      const currentlyOpen = $('#right-drawer').classList.contains('open');
      const isSameSprint = state.drawerType === 'sprint' && state.drawerItem === s;
      
      if (currentlyOpen && isSameSprint) {
        closeDrawer();
        state.drawerType = null;
        state.drawerItem = null;
        renderSprints();
      } else {
        state.drawerType = 'sprint';
        state.drawerItem = s;
        showSprintDetails(state.project, s);
        openDrawer();
        renderProjects();
        renderSprints();
        renderHus();
      }
    };

    el.appendChild(btnView);
    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);
    el.appendChild(actionsDiv);

    el.onclick = async () => {
      state.sprint = s; state.selectedHu = null; state.selectedCp = null;
      const loadRes = await window.api.loadTestCases({ project: state.project, sprint: s });
      if (loadRes.success && Object.keys(loadRes.data).length > 0) {
        state.parsedTestCases = loadRes.data;
      } else {
        state.parsedTestCases = null;
      }
      renderSprints(); renderHus(); renderCps();
    };
    list.appendChild(el);
  });

  $('#btn-add-hu').classList.toggle('hidden', !state.sprint);
  $('#btn-export-hu').classList.toggle('hidden', !state.sprint);
  $('#btn-parse-excel').classList.toggle('hidden', !state.sprint);
  makeSortable('dash-sprints-list', 'sprint', (newOrder) => {
    localStorage.setItem('sprintsOrder_' + state.project, JSON.stringify(newOrder));
  });
}

async function renderHus() {
  const list = $('#dash-hus-list');
  if (!state.sprint) { 
    list.innerHTML = translations[currentLang]['status-select-sprint']; 
    $('#btn-upload-files').classList.add('hidden');
    $('#btn-start-flow').classList.add('hidden');
    return; 
  }
  
  state.hus = await window.api.getHus({ project: state.project, sprint: state.sprint });
  const savedOrder = JSON.parse(localStorage.getItem('husOrder_' + state.project + '_' + state.sprint) || '[]');
  if (savedOrder.length > 0) {
    state.hus.sort((a, b) => {
      let idxA = savedOrder.indexOf(a.name);
      let idxB = savedOrder.indexOf(b.name);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });
  }
  list.innerHTML = '';
  
  if (state.hus.length === 0) {
    list.innerHTML = translations[currentLang]['status-no-hus'];
    $('#btn-upload-files').classList.add('hidden');
    $('#btn-start-flow').classList.add('hidden');
  }
  
  state.hus.forEach(hu => {
    const el = document.createElement('div');
    el.className = `dash-item ${state.selectedHu?.id === hu.id ? 'active' : ''}`;
    el.dataset.name = hu.name;
    el.setAttribute('draggable', 'true');
    
    const infoSpan = document.createElement('span');
    const huPrefix = hu.id.replace(/\d+$/, '');
    const huNumber = hu.id.match(/\d+$/)?.[0] || hu.id;
    infoSpan.innerHTML = `<strong><span class="hu-prefix">${huPrefix}</span>${huNumber}</strong>`;
    el.appendChild(infoSpan);

    const badgeSpan = document.createElement('span');
    badgeSpan.className = hu.hasAudio ? 'badge ok' : 'badge fail';
    badgeSpan.textContent = hu.hasAudio ? 'Audio OK' : 'No Audio';
    badgeSpan.style.marginLeft = '12px';
    badgeSpan.style.marginRight = '10px';
    el.appendChild(badgeSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '5px';

    const btnView = document.createElement('button');
    btnView.className = 'btn-icon view';
    
    const isDrawerOpen = $('#right-drawer').classList.contains('open');
    if (isDrawerOpen && state.selectedHu?.id === hu.id) {
      btnView.classList.add('active');
      btnView.style.color = 'var(--accent-color)';
    }
    
    btnView.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    btnView.title = 'View Details';
    btnView.onclick = (e) => {
      e.stopPropagation();
      const currentlyOpen = $('#right-drawer').classList.contains('open');
      const isSameHu = state.selectedHu?.id === hu.id;
      
      if (currentlyOpen && isSameHu) {
        closeDrawer();
        state.selectedHu = null;
        renderHus();
      } else {
        state.selectedHu = hu;
        showHuDetails(hu);
        openDrawer();
        renderHus();
      }
    };

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-icon edit';
    btnEdit.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>';
    btnEdit.title = translations[currentLang]['modal-rename-hu'];
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      openModal(translations[currentLang]['modal-rename-hu'], hu.name, async (val) => {
        const res = await window.api.renameHu({ project: state.project, sprint: state.sprint, oldName: hu.name, newName: val });
        if (res.success) {
          if (state.selectedHu?.id === hu.id) {
            state.selectedHu = null;
          }
          renderHus();
        } else {
          alert('Error: ' + res.error);
        }
      });
    };

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-icon delete';
    btnDelete.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
    btnDelete.title = 'Delete';
    btnDelete.onclick = (e) => {
      e.stopPropagation();
      const confText = translations[currentLang]['confirm-delete-hu'].replace('{name}', hu.name);
      openConfirmModal(translations[currentLang]['col-hus'], confText, () => {
        window.api.deleteHu({ project: state.project, sprint: state.sprint, huName: hu.name }).then((res) => {
          if (res.success) {
            if (state.selectedHu?.id === hu.id) {
              state.selectedHu = null;
            }
            renderHus();
          } else {
            alert('Error: ' + res.error);
          }
        });
      });
    };

    el.appendChild(btnView);
    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);
    el.appendChild(actionsDiv);

    el.onclick = () => { state.selectedHu = hu; state.selectedCp = null; renderHus(); showHuDetails(hu); };
    list.appendChild(el);
    
    if (state.selectedHu?.id === hu.id) {
      state.selectedHu = hu;
      showHuDetails(hu);
    }
  });

  makeSortable('dash-hus-list', 'hu', (newOrder) => {
    localStorage.setItem('husOrder_' + state.project + '_' + state.sprint, JSON.stringify(newOrder));
  });
}

async function persistTestCases() {
  if (!state.selectedHu || !state.parsedTestCases) return;
  const cpData = state.parsedTestCases[state.selectedHu.id] || [];
  await window.api.saveTestCases({
    project: state.project,
    sprint: state.sprint,
    huName: state.selectedHu.name,
    data: cpData
  });
}

function renderCps() {
  const t = translations[currentLang];
  const list = $('#dash-cps-list');
  list.innerHTML = '';

  $('#btn-export-cp').classList.toggle('hidden', !state.selectedHu);

  if (!state.selectedHu) {
    list.innerHTML = `<span style="font-size: 13px; color: #8b949e;">${t['cp-no-hu']}</span>`;
    return;
  }

  const parsedCps = state.parsedTestCases && state.parsedTestCases[state.selectedHu.id];
  if (!parsedCps || parsedCps.length === 0) {
    list.innerHTML = `<span style="font-size: 13px; color: #8b949e;">${state.parsedTestCases ? t['cp-no-data'] : t['cp-no-data']}</span>`;
    return;
  }

  parsedCps.forEach((cp, idx) => {
    const el = document.createElement('div');
    el.className = `dash-item ${state.selectedCp && state.selectedCp.id === cp.id ? 'active' : ''}`;
    el.dataset.cpIdx = idx;

    const infoSpan = document.createElement('span');
    infoSpan.style.cssText = 'display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;';
    infoSpan.innerHTML = `<strong style="white-space: nowrap;">${cp.id}</strong>
      <span style="font-size: 11px; color: #8b949e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${(cp.nombre || '').substring(0, 30)}</span>
      <span class="badge ${cp.is_positive ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 5px; white-space: nowrap;">${cp.is_positive ? t['cp-positive'] : t['cp-negative']}</span>`;
    el.appendChild(infoSpan);

    const btnView = document.createElement('button');
    btnView.className = 'btn-icon view';
    btnView.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    btnView.title = 'View Details';
    btnView.onclick = (e) => {
      e.stopPropagation();
      state.selectedCp = cp;
      showCpDetail(cp);
      openDrawer();
      renderCps();
    };
    el.appendChild(btnView);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'item-actions';
    actionsDiv.style.display = 'flex';
    actionsDiv.style.gap = '5px';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-icon edit';
    btnEdit.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>';
    btnEdit.title = t['cp-edit-title'];
    btnEdit.onclick = (e) => {
      e.stopPropagation();
      openCpEditModal(cp);
    };

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-icon delete';
    btnDelete.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
    btnDelete.title = 'Delete';
    btnDelete.onclick = (e) => {
      e.stopPropagation();
      const confText = t['cp-delete-confirm'].replace('{name}', cp.id + ' - ' + (cp.nombre || ''));
      openConfirmModal(cp.id, confText, async () => {
        const husCps = state.parsedTestCases[state.selectedHu.id];
        const cpIdx = husCps.findIndex(c => c.id === cp.id);
        if (cpIdx !== -1) {
          husCps.splice(cpIdx, 1);
          state.selectedCp = null;
          await persistTestCases();
          renderCps();
          closeDrawer();
        }
      });
    };

    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);
    el.appendChild(actionsDiv);

    el.onclick = () => {
      state.selectedCp = cp;
      showCpDetail(cp);
      openDrawer();
      renderCps();
    };

    list.appendChild(el);
  });
}

function openCpEditModal(cp) {
  const t = translations[currentLang];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width: 500px;">
      <h4 style="margin: 0 0 15px; color: var(--accent-color);">${t['cp-edit-title']} — ${cp.id}</h4>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label style="font-size: 12px; color: var(--text-color);">${t['cp-table-name']}:
          <input id="cp-edit-nombre" type="text" value="${(cp.nombre || '').replace(/"/g, '&quot;')}" style="width: 100%; padding: 6px 8px; margin-top: 4px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); font-size: 12px;">
        </label>
        <label style="font-size: 12px; color: var(--text-color);">${t['cp-detail-resumen']}
          <textarea id="cp-edit-resumen" rows="2" style="width: 100%; padding: 6px 8px; margin-top: 4px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); font-size: 12px; resize: vertical;">${cp.resumen || ''}</textarea>
        </label>
        <label style="font-size: 12px; color: var(--text-color);">${t['cp-detail-precondiciones']}
          <textarea id="cp-edit-precondiciones" rows="2" style="width: 100%; padding: 6px 8px; margin-top: 4px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); font-size: 12px; resize: vertical;">${cp.precondiciones || ''}</textarea>
        </label>
        <label style="font-size: 12px; color: var(--text-color);">${t['cp-detail-pasos']}
          <textarea id="cp-edit-pasos" rows="3" style="width: 100%; padding: 6px 8px; margin-top: 4px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); font-size: 12px; resize: vertical;">${cp.pasos || ''}</textarea>
        </label>
        <label style="font-size: 12px; color: var(--text-color);">${t['cp-detail-resultado']}
          <textarea id="cp-edit-resultado" rows="2" style="width: 100%; padding: 6px 8px; margin-top: 4px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 4px; color: var(--text-color); font-size: 12px; resize: vertical;">${cp.resultado_esperado || ''}</textarea>
        </label>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px;">
        <button class="btn btn-secondary" id="cp-edit-cancel">${t['btn-back']}</button>
        <button class="btn btn-primary" id="cp-edit-save">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector('#cp-edit-cancel').onclick = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#cp-edit-save').onclick = async () => {
    cp.nombre = overlay.querySelector('#cp-edit-nombre').value;
    cp.resumen = overlay.querySelector('#cp-edit-resumen').value;
    cp.precondiciones = overlay.querySelector('#cp-edit-precondiciones').value;
    cp.pasos = overlay.querySelector('#cp-edit-pasos').value;
    cp.resultado_esperado = overlay.querySelector('#cp-edit-resultado').value;
    overlay.remove();
    await persistTestCases();
    renderCps();
    if (state.selectedCp && state.selectedCp.id === cp.id) {
      showCpDetail(cp);
    }
  };
}

async function showProjectDetails(p) {
  const t = translations[currentLang];
  const details = await window.api.getProjectDetails(p);
  if (!details) return;

  const row = (label, value, badgeClass) => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
      <span style="font-weight: 500; font-size: 12px; color: var(--text-color);">${label}</span>
      ${badgeClass ? `<span class="badge ${badgeClass}">${value}</span>` : `<span style="font-size: 12px; color: var(--text-color);">${value}</span>`}
    </div>`;

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : t['detail-na'];

  const sprintRows = details.sprints.map(s => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 5px 8px; font-size: 11px; color: var(--text-color); font-weight: 500;">${s.name}</td>
      <td style="padding: 5px 8px; font-size: 11px; color: var(--text-color); text-align: center;">${s.huCount}</td>
      <td style="padding: 5px 8px; font-size: 11px; color: var(--text-color); text-align: center;">${s.cpCount}</td>
      <td style="padding: 5px 8px; font-size: 11px; text-align: center;">
        <span class="badge ${s.audioGuides === s.huCount ? 'ok' : s.audioGuides > 0 ? 'warn' : 'fail'}" style="font-size: 9px; padding: 1px 4px;">${s.audioGuides}/${s.huCount}</span>
      </td>
      <td style="padding: 5px 8px; font-size: 11px; text-align: center;">
        <span class="badge ${s.wordEvidence === s.huCount ? 'ok' : s.wordEvidence > 0 ? 'warn' : 'fail'}" style="font-size: 9px; padding: 1px 4px;">${s.wordEvidence}/${s.huCount}</span>
      </td>
    </tr>
  `).join('');

  $('#right-drawer-title').textContent = t['detail-title-projects'];
  $('#right-drawer-content').innerHTML = `
    <h4 style="color: #fff; font-size: 15px; word-break: break-all; margin-bottom: 10px;">${p}</h4>
    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px;">
      ${row(t['detail-total-sprints'], details.totalSprints, 'ok')}
      ${row(t['detail-total-hus'], details.totalHus, 'ok')}
      ${row(t['detail-total-cps'], details.totalCps, 'ok')}
      ${row(t['detail-audio-guides'], `${details.audioGuides}/${details.totalHus}`, details.audioGuides === details.totalHus ? 'ok' : details.audioGuides > 0 ? 'warn' : 'fail')}
      ${row(t['detail-word-evidence'], `${details.wordEvidence}/${details.totalHus}`, details.wordEvidence === details.totalHus ? 'ok' : details.wordEvidence > 0 ? 'warn' : 'fail')}
      ${row(t['detail-excel-files'], `${details.excelFiles}/${details.totalHus}`, details.excelFiles === details.totalHus ? 'ok' : details.excelFiles > 0 ? 'warn' : 'fail')}
      ${row(t['detail-last-modified'], fmtDate(details.lastModified))}
    </div>
    ${details.sprints.length > 0 ? `
    <div style="margin-top: 15px;">
      <h5 style="font-size: 13px; color: var(--accent-color); margin: 0 0 8px 0;">${t['detail-sprint-breakdown']}</h5>
      <div style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 6px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: var(--bg-panel); position: sticky; top: 0;">
              <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['col-sprints']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-hu-list']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-cps']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-audio']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-word']}</th>
            </tr>
          </thead>
          <tbody>${sprintRows}</tbody>
        </table>
      </div>
    </div>` : ''}
  `;
}

async function showSprintDetails(project, s) {
  const t = translations[currentLang];
  const summary = await window.api.getSprintSummary(project, s);
  if (!summary) return;

  const row = (label, value, badgeClass) => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
      <span style="font-weight: 500; font-size: 12px; color: var(--text-color);">${label}</span>
      ${badgeClass ? `<span class="badge ${badgeClass}">${value}</span>` : `<span style="font-size: 12px; color: var(--text-color);">${value}</span>`}
    </div>`;

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : t['detail-na'];

  const huRows = summary.hus.map(hu => `
    <tr style="border-bottom: 1px solid var(--border-color);">
      <td style="padding: 5px 8px; font-size: 11px; color: var(--text-color); font-weight: 500;">${hu.id}</td>
      <td style="padding: 5px 8px; font-size: 11px; color: var(--text-color); text-align: center;">${hu.cpCount}</td>
      <td style="padding: 5px 8px; font-size: 11px; text-align: center;">
        <span class="badge ${hu.hasExcel ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 4px;">${hu.hasExcel ? '✓' : '✗'}</span>
      </td>
      <td style="padding: 5px 8px; font-size: 11px; text-align: center;">
        <span class="badge ${hu.hasWord ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 4px;">${hu.hasWord ? '✓' : '✗'}</span>
      </td>
      <td style="padding: 5px 8px; font-size: 11px; text-align: center;">
        <span class="badge ${hu.hasAudio ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 4px;">${hu.hasAudio ? '✓' : '✗'}</span>
      </td>
    </tr>
  `).join('');

  $('#right-drawer-title').textContent = t['detail-title-sprints'];
  $('#right-drawer-content').innerHTML = `
    <h4 style="color: #fff; font-size: 15px; word-break: break-all; margin-bottom: 10px;">${s}</h4>
    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px;">
      ${row(t['exp-project'], project)}
      ${row(t['detail-total-hus'], summary.totalHus, 'ok')}
      ${row(t['detail-total-cps'], summary.totalCps, 'ok')}
      ${row(t['detail-positive-cps'], summary.positiveCps, 'ok')}
      ${row(t['detail-negative-cps'], summary.negativeCps, summary.negativeCps > 0 ? 'fail' : 'ok')}
      ${row(t['detail-audio-guides'], `${summary.audioGuides}/${summary.totalHus}`, summary.audioGuides === summary.totalHus ? 'ok' : summary.audioGuides > 0 ? 'warn' : 'fail')}
      ${row(t['detail-word-evidence'], `${summary.wordEvidence}/${summary.totalHus}`, summary.wordEvidence === summary.totalHus ? 'ok' : summary.wordEvidence > 0 ? 'warn' : 'fail')}
      ${row(t['detail-excel-files'], `${summary.excelFiles}/${summary.totalHus}`, summary.excelFiles === summary.totalHus ? 'ok' : summary.excelFiles > 0 ? 'warn' : 'fail')}
      ${row(t['detail-last-modified'], fmtDate(summary.lastModified))}
    </div>
    ${summary.hus.length > 0 ? `
    <div style="margin-top: 15px;">
      <h5 style="font-size: 13px; color: var(--accent-color); margin: 0 0 8px 0;">${t['detail-hu-list']} (${summary.hus.length})</h5>
      <div style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 6px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background: var(--bg-panel); position: sticky; top: 0;">
              <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-color);">HU</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-cps']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-excel-files']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-word']}</th>
              <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['detail-audio']}</th>
            </tr>
          </thead>
          <tbody>${huRows}</tbody>
        </table>
      </div>
    </div>` : ''}
  `;
}

async function showCpDetail(cp) {
  const t = translations[currentLang];
  $('#right-drawer-title').textContent = t['cp-detail-title'];
  const field = (label, value) => `
    <div style="margin-bottom: 10px;">
      <span style="font-weight: 600; font-size: 11px; color: var(--accent-color); text-transform: uppercase;">${label}</span>
      <div style="font-size: 12px; color: var(--text-color); margin-top: 3px; white-space: pre-wrap; line-height: 1.4;">${value || '-'}</div>
    </div>
  `;

  const parentHu = cp.hu_id || (state.selectedHu ? state.selectedHu.id : '');

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  let trazabilidad = {};
  try { trazabilidad = await window.api.loadTrazabilidad(); } catch (e) {}
  const traced = trazabilidad[parentHu] && trazabilidad[parentHu][cp.id];
  const trazRange = traced ? `${fmtTime(traced[0])} → ${fmtTime(traced[1])}` : null;

  const linkedFiles = [];
  if (state.selectedHu) {
    const hu = state.selectedHu;
    if (hu.hasExcel) linkedFiles.push({ type: 'Excel', name: hu.name.match(/\.xlsx$/) ? hu.name : `${hu.id}_design.xlsx`, icon: iconChart(14) });
    if (hu.hasWord) linkedFiles.push({ type: 'Word', name: `${cp.id}_evidence.docx`, icon: iconDocument(14) });
    if (hu.hasAudio) linkedFiles.push({ type: 'Audio Guide', name: `${hu.id}_guide.wav`, icon: iconAudio(14) });
  }

  $('#right-drawer-content').innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
      <button id="btn-cp-detail-back" class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px; min-width: auto;">
        ← ${t['cp-detail-back']}
      </button>
      <span class="badge ${cp.is_positive ? 'ok' : 'fail'}" style="font-size: 10px;">
        ${cp.is_positive ? t['cp-positive'] : t['cp-negative']}
      </span>
    </div>
    ${parentHu ? `<div style="font-size: 11px; color: #8b949e; margin-bottom: 6px;">${t['detail-parent-hu']}: <span style="color: var(--accent-color);">${parentHu}</span></div>` : ''}
    <h4 style="color: #fff; font-size: 14px; word-break: break-all; margin-bottom: 12px;">
      <span style="color: var(--accent-color); font-weight: 700;">${cp.id}</span> — ${cp.nombre || ''}
    </h4>
    <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px;">
      ${field(t['cp-detail-resumen'], cp.resumen)}
      ${field(t['cp-detail-contexto'], cp.contexto)}
      ${field(t['cp-detail-precondiciones'], cp.precondiciones)}
      ${field(t['cp-detail-pasos'], cp.pasos)}
      ${field(t['cp-detail-resultado'], cp.resultado_esperado)}
    </div>

    ${linkedFiles.length > 0 ? `
    <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px; margin-top: 12px;">
      <h5 style="font-size: 12px; color: var(--accent-color); margin: 0 0 8px 0;">${t['detail-linked-files']}</h5>
      ${linkedFiles.map(f => `
        <div style="display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 11px; color: var(--text-color); border-bottom: 1px solid var(--border-color);">
          <span>${f.icon}</span>
          <span style="font-weight: 500;">${f.type}:</span>
          <span style="color: #8b949e; word-break: break-all;">${f.name}</span>
        </div>
      `).join('')}
    </div>` : ''}

    <div style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px; margin-top: 12px;">
      <h5 style="font-size: 12px; color: var(--accent-color); margin: 0 0 8px 0;">${t['detail-trazabilidad']}</h5>
      ${trazRange ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: var(--text-color);">${t['detail-trazabilidad-video']}</span>
          <span class="badge ok" style="font-size: 10px;">${trazRange}</span>
        </div>
      ` : `<div style="font-size: 12px; color: #8b949e;">${t['detail-no-trazabilidad']}</div>`}
    </div>
  `;

  $('#btn-cp-detail-back').onclick = () => {
    state.selectedCp = null;
    closeDrawer();
    renderCps();
  };
}

async function showHuDetails(hu) {
  const t = translations[currentLang];
  $('#right-drawer-title').textContent = t['detail-title-hus'];

  const parsedCps = state.parsedTestCases && state.parsedTestCases[hu.id];

  let evidenceData = { grouped: [] };
  try { evidenceData = await window.api.listHuEvidence({ project: state.project, sprint: state.sprint, huName: hu.name }); } catch (e) {}

  let trazabilidad = {};
  try { trazabilidad = await window.api.loadTrazabilidad(); } catch (e) {}
  const tracedCps = trazabilidad[hu.id] ? Object.keys(trazabilidad[hu.id]).length : 0;
  const totalCpsFromHu = hu.cpCount || (parsedCps ? parsedCps.length : 0);

  const videos = evidenceData.grouped ? evidenceData.grouped.filter(g => g.video).length : 0;
  const screenshots = evidenceData.grouped ? evidenceData.grouped.filter(g => g.screenshot).length : 0;
  const findings = evidenceData.grouped ? evidenceData.grouped.filter(g => g.meta).length : 0;

  const row = (label, value, badgeClass) => `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
      <span style="font-weight: 500; font-size: 12px; color: var(--text-color);">${label}</span>
      ${badgeClass ? `<span class="badge ${badgeClass}">${value}</span>` : `<span style="font-size: 12px; color: var(--text-color); word-break: break-all; text-align: right; max-width: 55%;">${value}</span>`}
    </div>`;

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : t['detail-na'];

  const shortPath = hu.path ? hu.path.replace(/\\/g, '/').split('/').slice(-3).join('/') : '';

  let cpTableHtml = '';
  if (parsedCps && parsedCps.length > 0) {
    const cpRows = parsedCps.map((cp, idx) => {
      const traced = trazabilidad[hu.id] && trazabilidad[hu.id][cp.id];
      return `
        <tr data-cp-idx="${idx}" style="border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background 0.15s;">
          <td style="padding: 5px 8px; color: var(--text-color); font-weight: 500;">${cp.id}</td>
          <td style="padding: 5px 8px; color: var(--text-color);">${cp.nombre || '-'}</td>
          <td style="padding: 5px 8px;">
            <span class="badge ${cp.is_positive ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 5px;">
              ${cp.is_positive ? t['cp-positive'] : t['cp-negative']}
            </span>
          </td>
          <td style="padding: 5px 8px; text-align: center;">
            <span class="badge ${traced ? 'ok' : 'fail'}" style="font-size: 9px; padding: 1px 5px;">
              ${traced ? '✓' : '✗'}
            </span>
          </td>
        </tr>`;
    }).join('');

    cpTableHtml = `
      <div style="margin-top: 15px;">
        <h5 style="font-size: 13px; color: var(--accent-color); margin: 0 0 8px 0;">
          ${t['detail-cps']} (${parsedCps.length})
        </h5>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 6px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background: var(--bg-panel); position: sticky; top: 0;">
                <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['cp-table-id']}</th>
                <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['cp-table-name']}</th>
                <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-color);">${t['cp-table-type']}</th>
                <th style="padding: 6px 8px; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-color);">Traz.</th>
              </tr>
            </thead>
            <tbody>${cpRows}</tbody>
          </table>
        </div>
      </div>
    `;
  } else if (state.parsedTestCases) {
    cpTableHtml = `
      <div style="margin-top: 15px; padding: 10px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 6px; font-size: 12px; color: #8b949e;">
        ${t['cp-no-data']}
      </div>
    `;
  }

  $('#right-drawer-content').innerHTML = `
    <h4 style="color: #fff; font-size: 15px; word-break: break-all; margin-bottom: 6px;">${hu.id}: ${hu.name}</h4>
    ${shortPath ? `<div style="font-size: 10px; color: #8b949e; margin-bottom: 10px; word-break: break-all;">${iconFolder(10)} ${shortPath}</div>` : ''}

    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px;">
      <h5 style="font-size: 12px; color: var(--accent-color); margin: 0 0 4px 0;">${t['detail-summary']}</h5>
      ${row(t['status-excel-label'], hu.hasExcel ? t['status-found'] : t['status-missing'], hu.hasExcel ? 'ok' : 'fail')}
      ${row(t['status-word-label'], hu.hasWord ? t['status-found'] : t['status-missing'], hu.hasWord ? 'ok' : 'fail')}
      ${row(t['status-audio-label'], hu.hasAudio ? t['status-generated'] : t['status-missing'], hu.hasAudio ? 'ok' : 'fail')}
      ${row(t['detail-file-count'], hu.fileCount || '-')}
      ${row(t['detail-evidence-count'], hu.evidenceCount || '0')}
      ${hu.lastModified ? row(t['detail-last-modified'], fmtDate(hu.lastModified)) : ''}
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px; margin-top: 12px;">
      <h5 style="font-size: 12px; color: var(--accent-color); margin: 0 0 4px 0;">${t['detail-total-cps']}</h5>
      ${row(t['detail-total-cps'], totalCpsFromHu, 'ok')}
      ${row(t['detail-positive-cps'], hu.positiveCount || 0, 'ok')}
      ${row(t['detail-negative-cps'], hu.negativeCount || 0, (hu.negativeCount || 0) > 0 ? 'fail' : 'ok')}
      ${row(t['detail-trazabilidad'], `${tracedCps}/${totalCpsFromHu} ${t['detail-traced']}`, tracedCps === totalCpsFromHu && totalCpsFromHu > 0 ? 'ok' : tracedCps > 0 ? 'warn' : 'fail')}
    </div>

    ${(videos > 0 || screenshots > 0 || findings > 0) ? `
    <div style="display: flex; flex-direction: column; gap: 10px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 14px; margin-top: 12px;">
      <h5 style="font-size: 12px; color: var(--accent-color); margin: 0 0 4px 0;">${t['detail-evidence-count']}</h5>
      ${row(t['detail-evidence-videos'], videos, videos > 0 ? 'ok' : 'fail')}
      ${row(t['detail-evidence-screenshots'], screenshots, screenshots > 0 ? 'ok' : 'fail')}
      ${row(t['detail-evidence-findings'], findings, findings > 0 ? 'ok' : 'fail')}
    </div>` : ''}

    ${cpTableHtml}
  `;
  
  $('#btn-start-flow').disabled = !hu.hasExcel;
  $('#btn-upload-files').classList.remove('hidden');
  $('#btn-start-flow').classList.remove('hidden');

  const parsedCpsDetail = state.parsedTestCases && state.parsedTestCases[hu.id];
  if (parsedCpsDetail) {
    const rows = document.querySelectorAll('#right-drawer-content tbody tr[data-cp-idx]');
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => { row.style.background = 'var(--bg-panel)'; });
      row.addEventListener('mouseleave', () => { row.style.background = ''; });
      row.addEventListener('click', () => {
        const idx = parseInt(row.dataset.cpIdx);
        if (parsedCpsDetail[idx]) {
          state.selectedCp = parsedCpsDetail[idx];
          showCpDetail(parsedCpsDetail[idx]);
        }
      });
    });
  }

  renderCps();
}

// Subida de archivos
$('#btn-upload-files').onclick = async () => {
  const files = await window.api.selectFiles();
  if (files && files.length > 0) {
    const res = await window.api.uploadFile({ 
      project: state.project, sprint: state.sprint, huName: state.selectedHu.name, filePaths: files 
    });
    if (res.success) renderHus();
    else alert('Error: ' + res.error);
  }
};

// Drag and drop helper
function makeSortable(containerId, type, onOrderChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let dragEl = null;
  
  container.ondragstart = (e) => {
    const item = e.target.closest('.dash-item');
    if (!item) return;
    dragEl = item;
    item.classList.add('dragging');
  };
  
  container.ondragover = (e) => {
    e.preventDefault();
    const draggingItem = container.querySelector('.dragging');
    if (!draggingItem) return;
    const siblings = [...container.querySelectorAll('.dash-item:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
      const box = sibling.getBoundingClientRect();
      return e.clientY <= box.top + box.height / 2;
    });
    container.insertBefore(draggingItem, nextSibling);
  };
  
  container.ondragend = (e) => {
    const item = e.target.closest('.dash-item');
    if (item) item.classList.remove('dragging');
    
    const newOrder = [...container.querySelectorAll('.dash-item')].map(el => el.dataset.name);
    if (onOrderChange) onOrderChange(newOrder);
  };
}

// Modal de detalles HU cerrar
$('#btn-hu-details-close').onclick = () => {
  closeDrawer();
  state.drawerType = null;
  state.drawerItem = null;
  renderProjects();
  renderSprints();
  renderHus();
};

// Click on compact column labels (Projects/Sprints) closes the drawer
$('.dashboard-grid').addEventListener('click', (e) => {
  const vIcon = e.target.closest('.col-v-collapse-icon');
  if (vIcon) {
    const col = vIcon.closest('.dash-col');
    if (col) {
      col.classList.toggle('h-collapsed');
      vIcon.textContent = col.classList.contains('h-collapsed') ? '↓' : '—';
    }
    return;
  }
  const icon = e.target.closest('.col-collapse-icon');
  if (icon) {
    const col = icon.closest('.dash-col');
    if (col) col.classList.toggle('collapsed');
    return;
  }
  const h3 = e.target.closest('.dash-col-header h3');
  if (h3) {
    const col = h3.closest('.dash-col');
    if (col && col.classList.contains('collapsed')) {
      col.classList.remove('collapsed');
      return;
    }
  }
  if (!h3) return;
  const grid = $('.dashboard-grid');
  if (!grid || !grid.classList.contains('drawer-open')) return;
  closeDrawer();
  state.drawerType = null;
  state.drawerItem = null;
  renderProjects();
  renderSprints();
  renderHus();
});

// Modales genéricos
const modal = $('#modal-overlay');
const mInput = $('#modal-input');
let modalCallback = null;

function openModal(title, placeholder, cb) {
  $('#modal-title').textContent = title;
  mInput.classList.remove('hidden');
  mInput.placeholder = placeholder;
  mInput.value = '';
  
  const msgEl = $('#modal-message');
  if (msgEl) msgEl.classList.add('hidden');
  
  modalCallback = cb;
  modal.classList.remove('hidden');
  mInput.focus();
}

function openConfirmModal(title, message, onConfirm) {
  $('#modal-title').textContent = title;
  mInput.classList.add('hidden');
  
  let msgEl = document.getElementById('modal-message');
  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = 'modal-message';
    msgEl.style.marginBottom = '20px';
    msgEl.style.color = 'var(--text-color)';
    msgEl.style.lineHeight = '1.5';
    mInput.parentNode.appendChild(msgEl);
  }
  msgEl.classList.remove('hidden');
  msgEl.textContent = message;
  
  modalCallback = onConfirm;
  modal.classList.remove('hidden');
  $('#btn-modal-save').focus();
}

function showDarkAlert(title, message) {
  $('#modal-title').textContent = title;
  mInput.classList.add('hidden');
  
  let msgEl = document.getElementById('modal-message');
  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = 'modal-message';
    msgEl.style.marginBottom = '20px';
    msgEl.style.color = 'var(--text-color)';
    msgEl.style.lineHeight = '1.5';
    mInput.parentNode.appendChild(msgEl);
  }
  msgEl.classList.remove('hidden');
  msgEl.textContent = message;
  
  $('#btn-modal-cancel').classList.add('hidden');
  const saveBtn = $('#btn-modal-save');
  const oldText = saveBtn.textContent;
  saveBtn.textContent = 'OK';
  
  modalCallback = () => {
    $('#btn-modal-cancel').classList.remove('hidden');
    saveBtn.textContent = oldText;
  };
  
  modal.classList.remove('hidden');
  saveBtn.focus();
}

window.alert = function (message) {
  const title = translations[currentLang]['app-title'] || 'Alert';
  showDarkAlert(title, message);
};

$('#btn-modal-cancel').onclick = () => modal.classList.add('hidden');
$('#btn-modal-save').onclick = async () => {
  const isConfirm = mInput.classList.contains('hidden');
  if (!isConfirm && !mInput.value.trim()) return;
  modal.classList.add('hidden');
  if (modalCallback) {
    if (isConfirm) {
      await modalCallback();
    } else {
      await modalCallback(mInput.value.trim());
    }
  }
};

$('#btn-add-project').onclick = () => openModal(translations[currentLang]['modal-new-project'], 'Ej: QA_Automation', async (val) => {
  await window.api.createProject(val);
  renderProjects();
});

// Set button icons (icon-only buttons)
$('#btn-import-project').innerHTML = iconImport(14);
$('#btn-export-project').innerHTML = iconExport(14);
$('#btn-export-sprint').innerHTML = iconExport(14);
$('#btn-export-hu').innerHTML = iconExport(14);
$('#btn-export-cp').innerHTML = iconExport(14);
$('#btn-add-project').innerHTML = iconPlus(12);
$('#btn-add-sprint').innerHTML = iconPlus(12);
$('#btn-add-hu').innerHTML = iconPlus(12);

// Export Project
async function exportCurrentProject() {
  if (!state.project) return;
  const defaultName = `${state.project}.zip`;
  const destPath = await window.api.selectExportPath(defaultName);
  if (!destPath) return;
  const res = await window.api.exportProject({ project: state.project, destPath });
  if (res.success) {
    showDarkAlert(
      currentLang === 'es' ? 'Exportación Exitosa' : 'Export Successful',
      currentLang === 'es'
        ? `Proyecto exportado a:\n${res.path}`
        : `Project exported to:\n${res.path}`
    );
  } else {
    alert(res.error);
  }
}

$('#btn-export-project').onclick = exportCurrentProject;
$('#btn-export-sprint').onclick = exportCurrentProject;
$('#btn-export-hu').onclick = exportCurrentProject;
$('#btn-export-cp').onclick = exportCurrentProject;

// Import Project
const importChoiceModal = $('#modal-import-choice-overlay');

$('#btn-import-project').onclick = () => {
  importChoiceModal.classList.remove('hidden');
};

$('#btn-import-choice-cancel').onclick = () => {
  importChoiceModal.classList.add('hidden');
};

$('#btn-import-zip').onclick = async () => {
  importChoiceModal.classList.add('hidden');
  await executeImport('zip');
};

$('#btn-import-folder').onclick = async () => {
  importChoiceModal.classList.add('hidden');
  await executeImport('folder');
};

async function executeImport(type) {
  try {
    let source;
    if (type === 'zip') {
      source = await window.api.selectProjectZip();
    } else {
      source = await window.api.selectProjectFolder();
    }

    if (!source) return;

    const res = await window.api.importProject({ source, type });

    if (res.success) {
      await renderProjects();
      const msg = currentLang === 'es'
        ? `Proyecto "${res.projectName}" importado correctamente.\n\nSprints: ${res.sprints.join(', ')}`
        : `Project "${res.projectName}" imported successfully.\n\nSprints: ${res.sprints.join(', ')}`;
      showDarkAlert(
        currentLang === 'es' ? 'Importación Exitosa' : 'Import Successful',
        msg
      );
    } else {
      alert(res.error);
    }
  } catch (err) {
    console.error('Import error:', err);
    alert('Error: ' + err.message);
  }
}

$('#btn-add-sprint').onclick = () => openModal(translations[currentLang]['modal-new-sprint'], 'Ej: sprint-03', async (val) => {
  await window.api.createSprint({ project: state.project, sprintName: val });
  renderSprints();
});

$('#btn-add-hu').onclick = () => openModal(translations[currentLang]['modal-new-hu'], 'Ej: HU-123_Login', async (val) => {
  await window.api.createHu({ project: state.project, sprint: state.sprint, huName: val });
  renderHus();
});

$('#btn-parse-excel').addEventListener('click', async () => {
  if (!state.project || !state.sprint) return;
  const t = translations[currentLang];
  const confirmMsg = currentLang === 'es'
    ? `Se leerán los archivos Excel de todas las HUs del sprint "${state.sprint}" y se extraerán los casos de prueba. ¿Continuar?`
    : `Excel files from all HUs in sprint "${state.sprint}" will be read and test cases will be extracted. Continue?`;
  openConfirmModal(t['btn-parse-excel'], confirmMsg, async () => {
    const res = await window.api.parseExcel({ project: state.project, sprint: state.sprint });
    if (res.success) {
      state.parsedTestCases = res.data;
      const totalCps = Object.values(res.data).reduce((sum, arr) => sum + arr.length, 0);
      const totalHus = Object.keys(res.data).length;

      const hus = await window.api.getHus({ project: state.project, sprint: state.sprint });
      for (const hu of hus) {
        const cpData = res.data[hu.id] || [];
        await window.api.saveTestCases({
          project: state.project,
          sprint: state.sprint,
          huName: hu.name,
          data: cpData
        });
      }

      const msg = currentLang === 'es'
        ? `Excel parseado y guardado exitosamente.\n\nHUs con CPs: ${totalHus}\nTotal de casos de prueba: ${totalCps}`
        : `Excel parsed and saved successfully.\n\nHUs with CPs: ${totalHus}\nTotal test cases: ${totalCps}`;
      showDarkAlert(t['btn-parse-excel'], msg);
      if (state.selectedHu) showHuDetails(state.selectedHu);
    } else {
      alert('Error: ' + res.error);
    }
  });
});

$('#btn-organize-insumos').addEventListener('click', async () => {
  if (!state.project) return;
  const t = translations[currentLang];
  const confirmMsg = currentLang === 'es'
    ? `Se organizarán los archivos multimedia (videos, imágenes, JSON) de todas las HUs del proyecto "${state.project}" en carpetas Insumos/. ¿Continuar?`
    : `Multimedia files (videos, images, JSON) from all HUs in project "${state.project}" will be organized into Insumos/ folders. Continue?`;
  openConfirmModal(t['btn-organize-insumos'], confirmMsg, async () => {
    const res = await window.api.organizeInsumos({ project: state.project });
    if (res.success) {
      const msg = currentLang === 'es'
        ? `Proyecto "${state.project}" organizado.\n\nHUs procesadas: ${res.totalHus}\nArchivos movidos: ${res.totalMoved}`
        : `Project "${state.project}" organized.\n\nHUs processed: ${res.totalHus}\nFiles moved: ${res.totalMoved}`;
      showDarkAlert(t['btn-organize-insumos'], msg);
    } else {
      alert('Error: ' + res.error);
    }
  });
});

$('#btn-generate-evidence').addEventListener('click', async () => {
  if (!state.project) return;
  const t = translations[currentLang];
  let scope, scopeOpts;
  if (state.selectedHu) {
    scope = state.selectedHu.id;
    scopeOpts = { project: state.project, huId: state.selectedHu.id };
  } else if (state.sprint) {
    scope = state.sprint;
    scopeOpts = { project: state.project, sprint: state.sprint };
  } else {
    scope = currentLang === 'es' ? 'todo el proyecto' : 'all project';
    scopeOpts = { project: state.project };
  }
  const confirmMsg = currentLang === 'es'
    ? `Se generará evidencia para ${scope}. Esto analizará los Insumos y los relacionará con los casos de prueba. ¿Continuar?`
    : `Evidence will be generated for ${scope}. This will analyze Insumos and match them with test cases. Continue?`;
  openConfirmModal(t['btn-generate-evidence'], confirmMsg, async () => {
    const btn = $('#btn-generate-evidence');
    const originalText = btn.textContent;
    btn.innerHTML = currentLang === 'es' ? `${iconLoading(14)} Generando...` : `${iconLoading(14)} Generating...`;
    btn.disabled = true;
    try {
      const res = await window.api.generateEvidence(scopeOpts);
      if (res.success) {
        const msg = currentLang === 'es'
          ? `Evidencia generada exitosamente para ${scope}.\n\nLos documentos Word se guardaron en cada carpeta de HU.`
          : `Evidence generated successfully for ${scope}.\n\nWord documents were saved in each HU folder.`;
        showDarkAlert(t['btn-generate-evidence'], msg);
      } else {
        const errMsg = res.error ? res.error.split('\n').slice(-3).join('\n') : 'Unknown error';
        alert('Error: ' + errMsg);
      }
    } catch (e) {
      const errMsg = e.message ? e.message.split('\n').slice(-3).join('\n') : String(e);
      alert('Error: ' + errMsg);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
});

$('#btn-start-flow').onclick = () => loadHuReview(state.selectedHu);

// ─── Phase 2: Review ─────────────────────────────────────────────────────────

async function loadHuReview(hu) {
  const t = translations[currentLang];
  state.selectedHu = hu;
  
  // Close details drawer if open
  closeDrawer();
  
  // Show and update the sidebar HU details sub section
  const sidebarHuDetails = $('#sidebar-hu-details');
  sidebarHuDetails.classList.remove('hidden');
  
  $('#sidebar-hu-title').textContent = `${hu.id}: ${hu.name}`;
  $('#sidebar-status-excel').className = `badge ${hu.hasExcel ? 'ok' : 'fail'}`;
  $('#sidebar-status-excel').innerHTML = hu.hasExcel ? t['status-found'] : t['status-missing'];
  
  $('#sidebar-status-word').className = `badge ${hu.hasWord ? 'ok' : 'fail'}`;
  $('#sidebar-status-word').innerHTML = hu.hasWord ? t['status-found'] : t['status-missing'];
  
  $('#sidebar-status-audio').className = `badge ${hu.hasAudio ? 'ok' : 'fail'}`;
  $('#sidebar-status-audio').innerHTML = hu.hasAudio ? t['status-generated'] : t['status-missing'];
  
  const pnl = $('#audio-status-panel');
  const preview = $('#cp-script-preview');
  
  if (!hu.hasAudio) {
    pnl.className = 'status-panel warn';
    pnl.innerHTML = `<h3>${t['audio-missing-title']}</h3><p>${t['audio-missing-text']}</p>`;
    preview.innerHTML = '';
    
    $('#btn-generate-audio').classList.remove('hidden');
    $('#btn-generate-audio').textContent = t['btn-generate-audio'];
    $('#btn-go-region').classList.add('hidden');
  } else {
    const res = await window.api.loadAudioGuide({ project: state.project, sprint: state.sprint, huName: hu.name, huId: hu.id });
    if (res.success) {
      state.mdContent = res.mdContent;
      state.audioBase64 = res.audioBase64;
      state.durations = res.durations || [];

      const blocks = state.mdContent.split(/^(?=### Paso)/m);
      state.segments = [];
      let elapsed = 0;
      if (state.durations.length > 0) {
        state.segments.push({ title: currentLang === 'es' ? "Introducción" : "Introduction", start: elapsed, duration: state.durations[0], text: blocks[0] });
        elapsed += state.durations[0];
        for(let i=1; i<blocks.length; i++) {
          const d = state.durations[i] || 0;
          state.segments.push({ title: blocks[i].split('\n')[0].replace('###', '').trim(), start: elapsed, duration: d, text: blocks[i] });
          elapsed += d;
        }
      } else {
        state.segments.push({ title: currentLang === 'es' ? "Guía Completa" : "Full Guide", start: 0, duration: 9999, text: state.mdContent });
      }
      
      pnl.className = 'status-panel ok';
      pnl.innerHTML = `<h3>${t['audio-ready-title']}</h3><p>${t['audio-ready-text']}</p>`;
      preview.textContent = res.mdContent;
      
      $('#btn-generate-audio').classList.remove('hidden');
      $('#btn-generate-audio').textContent = t['btn-regenerate-audio'];
      $('#btn-go-region').classList.remove('hidden');
    } else {
      pnl.className = 'status-panel warn';
      pnl.innerHTML = `<h3>Error</h3><p>${res.error}</p>`;
    }
  }
  showPhase('review');
}

$('#btn-generate-audio').addEventListener('click', async () => {
  const btn = $('#btn-generate-audio');
  btn.disabled = true;
  btn.textContent = currentLang === 'es' ? 'Generando en background...' : 'Generating in background...';
  
  const res = await window.api.generateAudioGuide({ project: state.project, huId: state.selectedHu.id });
  if (res.success) {
    state.selectedHu.hasAudio = true;
    loadHuReview(state.selectedHu);
  } else {
    alert('Error: ' + res.error);
  }
  
  btn.disabled = false;
  btn.textContent = translations[currentLang]['btn-generate-audio'];
});

$('#btn-back-select').addEventListener('click', () => showPhase('dashboard'));

// ─── Phase 3: Region Select ──────────────────────────────────────────────────

$('#btn-go-region').addEventListener('click', async () => {
  showPhase('region');
  
  const sources = await window.api.getScreenSources();
  state.screenSources = sources;
  const select = $('#screen-select');
  select.innerHTML = `<option value="">-- ${currentLang === 'es' ? 'Selecciona ventana/pantalla' : 'Select window/screen'} --</option>`;
  sources.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id; opt.textContent = s.name;
    select.appendChild(opt);
  });

  console.log('[Sources] All available:', sources.map(s => ({ id: s.id, name: s.name, displayId: s.displayId })));

  select.onchange = async (e) => {
    state.selectedSourceId = e.target.value;
    // Also save the displayId so the main process can locate the correct monitor
    const selectedSource = sources.find(s => s.id === state.selectedSourceId);
    state.selectedDisplayId = selectedSource ? selectedSource.displayId : null;
    console.log('[Source Selected] sourceId:', state.selectedSourceId, '| displayId:', state.selectedDisplayId);
    if (state.selectedSourceId) await startPreviewStream(state.selectedSourceId);
  };
});

$('#btn-back-review').addEventListener('click', () => {
  stopPreviewStream();
  showPhase('review');
});

const cropBox = $('#crop-box');
const cropInfo = $('#crop-info');
const imgEl = $('#preview-image');
let isDragging = false;
let dragType = null;
let startPos = { x: 0, y: 0 };
let boxPos = { x: 50, y: 50, w: 400, h: 300 };

async function startPreviewStream(sourceId) {
  stopPreviewStream();
  const source = state.screenSources.find(s => s.id === sourceId);
  if (!source || !source.thumbnail) return;
  
  imgEl.src = source.thumbnail;
  imgEl.onload = () => {
    cropBox.classList.remove('hidden');
    cropInfo.classList.remove('hidden');
    updateCropBox();
  };
}

function stopPreviewStream() {
  imgEl.src = '';
  cropBox.classList.add('hidden');
  cropInfo.classList.add('hidden');
}

cropBox.addEventListener('mousedown', e => {
  isDragging = true;
  startPos = { x: e.clientX, y: e.clientY };
  if (e.target.classList.contains('nw')) dragType = 'nw';
  else if (e.target.classList.contains('ne')) dragType = 'ne';
  else if (e.target.classList.contains('sw')) dragType = 'sw';
  else if (e.target.classList.contains('se')) dragType = 'se';
  else dragType = 'move';
  e.preventDefault();
});

window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  const dx = e.clientX - startPos.x;
  const dy = e.clientY - startPos.y;
  startPos = { x: e.clientX, y: e.clientY };

  if (dragType === 'move') { boxPos.x += dx; boxPos.y += dy; }
  else if (dragType === 'se') { boxPos.w += dx; boxPos.h += dy; }
  else if (dragType === 'nw') { boxPos.x += dx; boxPos.y += dy; boxPos.w -= dx; boxPos.h -= dy; }
  else if (dragType === 'ne') { boxPos.y += dy; boxPos.w += dx; boxPos.h -= dy; }
  else if (dragType === 'sw') { boxPos.x += dx; boxPos.w -= dx; boxPos.h += dy; }
  
  const bounds = imgEl.getBoundingClientRect();
  boxPos.x = Math.max(0, Math.min(boxPos.x, bounds.width - boxPos.w));
  boxPos.y = Math.max(0, Math.min(boxPos.y, bounds.height - boxPos.h));
  boxPos.w = Math.max(100, boxPos.w);
  boxPos.h = Math.max(100, boxPos.h);
  
  updateCropBox();
});

window.addEventListener('mouseup', () => { isDragging = false; dragType = null; });

function updateCropBox() {
  cropBox.style.left = boxPos.x + 'px';
  cropBox.style.top = boxPos.y + 'px';
  cropBox.style.width = boxPos.w + 'px';
  cropBox.style.height = boxPos.h + 'px';

  const bounds = imgEl.getBoundingClientRect();
  const vW = imgEl.naturalWidth || 1920;
  const vH = imgEl.naturalHeight || 1080;
  
  const scale = Math.min(bounds.width / vW, bounds.height / vH);
  const actW = vW * scale;
  const actH = vH * scale;
  const actX = (bounds.width - actW) / 2;
  const actY = (bounds.height - actH) / 2;

  const cropX = Math.round(((boxPos.x - actX) / actW) * vW);
  const cropY = Math.round(((boxPos.y - actY) / actH) * vH);
  const cropW = Math.round((boxPos.w / actW) * vW);
  const cropH = Math.round((boxPos.h / actH) * vH);

  state.crop = {
    x: Math.max(0, Math.min(cropX, vW)),
    y: Math.max(0, Math.min(cropY, vH)),
    w: Math.max(0, Math.min(cropW, vW)),
    h: Math.max(0, Math.min(cropH, vH)),
  };
  cropInfo.textContent = `X:${state.crop.x} Y:${state.crop.y} | W:${state.crop.w} H:${state.crop.h}`;
}

// ─── Phase 4: Recording ──────────────────────────────────────────────────────

function base64ToArrayBuffer(b64) {
  const binaryStr = atob(b64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
  return bytes.buffer;
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.recordingStartTime = performance.now();
  state.timerInterval = setInterval(() => {
    const elapsed = state.elapsedTimeBeforePause + (performance.now() - state.recordingStartTime) / 1000;
    $('#recording-timer').textContent = fmtTime(elapsed);
  }, 200);
}

function pauseTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.elapsedTimeBeforePause += (performance.now() - state.recordingStartTime) / 1000;
  $('.recording-dot').classList.add('paused');
}

$('#btn-start-recording').addEventListener('click', async () => {
  if (!state.selectedSourceId) { alert(currentLang === 'es' ? 'Selecciona una fuente primero.' : 'Select a source first.'); return; }
  
  if (!state.audioContext) state.audioContext = new AudioContext({ sampleRate: 48000 });
  if (state.audioContext.state === 'suspended') await state.audioContext.resume();
  
  const audioData = base64ToArrayBuffer(state.audioBase64);
  state.audioBuffer = await state.audioContext.decodeAudioData(audioData);
  
  state.audioDestination = state.audioContext.createMediaStreamDestination();
  state.recordedChunks = [];
  state.mediaRecorder = new MediaRecorder(state.audioDestination.stream, { mimeType: 'audio/webm' });
  state.mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) state.recordedChunks.push(e.data); };
  
  $('#recording-hu-id').textContent = state.selectedHu.id;
  $('#script-reference').textContent = translations[currentLang]['script-ref-wait'];
  
  const listItems = $('#cp-list-items');
  listItems.innerHTML = '';
  state.segments.forEach((seg, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style = 'text-align: left; font-size: 12px; padding: 6px; background: #21262d; border: 1px solid #30363d; color: #c9d1d9; cursor: pointer; margin-bottom: 4px;';
    btn.textContent = `▶ ${seg.title}`;
    btn.onclick = () => playSegment(idx);
    listItems.appendChild(btn);
  });
  
  state.isRecording = true;
  state.cpTimestamps = [];
  state.elapsedTimeBeforePause = 0;
  state.recordingStartTime = performance.now();
  
  $('.recording-dot').classList.remove('paused');
  startTimer();
 
  showPhase('recording');
  
  await window.api.startRecording({
    project: state.project,
    sprint: state.sprint,
    huName: state.selectedHu.name,
    huId: state.selectedHu.id,
    crop: state.crop,
    sourceId: state.selectedSourceId,
    displayId: state.selectedDisplayId
  });
 
  state.mediaRecorder.start(100);

  // Listen for overlay control buttons (play / pause / stop)
  window.api.onOverlayControl((action) => {
    if (action === 'play') {
      playSegment(-1); // play all continuous from start
    } else if (action === 'pause') {
      if (isAudioPlaying) {
        playOffset += (state.audioContext.currentTime - playStartTime);
        stopCurrentAudio();
        pauseTimer();
      }
    } else if (action === 'resume') {
      if (!isAudioPlaying && state.segments[currentSegmentIdx]) {
        $('.recording-dot').classList.remove('paused');
        startTimer();
        playFrom(currentSegmentIdx, playOffset);
      }
    } else if (action === 'stop') {
      stopCurrentAudio();
      pauseTimer();
    }
  });
});
 
let currentAudioNode = null;
let playOffset = 0;
let playStartTime = 0;
let isAudioPlaying = false;
let isContinuous = false;
let currentSegmentIdx = 0;
 
window.stopCurrentAudio = function() {
  if (currentAudioNode) {
    currentAudioNode.onended = null;
    try { currentAudioNode.stop(); } catch(e){}
    currentAudioNode = null;
  }
  isAudioPlaying = false;
};
 
window.playFrom = function(idx, offsetIntoSegment) {
  const seg = state.segments[idx];
  if (!seg) return;
  
  $('#script-reference').textContent = seg.text;
  
  const cleanText = seg.text.replace(/^[#\s]+/gm, '').trim();
  window.api.updateOverlayText(cleanText);
  
  currentAudioNode = state.audioContext.createBufferSource();
  currentAudioNode.buffer = state.audioBuffer;
  currentAudioNode.connect(state.audioDestination);
  currentAudioNode.connect(state.audioContext.destination);
  
  const startPos = seg.start + offsetIntoSegment;
  const durationLeft = seg.duration - offsetIntoSegment;
  
  currentAudioNode.start(0, startPos, durationLeft);
  currentAudioNode.playbackRate.value = state.playbackSpeed;
  isAudioPlaying = true;
  playStartTime = state.audioContext.currentTime;
  playOffset = offsetIntoSegment;
  
  currentAudioNode.onended = () => {
    isAudioPlaying = false;
    const now = (performance.now() - state.recordingStartTime) / 1000;
    state.cpTimestamps.push({ id: seg.title.substring(0, 15).replace(/\s/g, '_'), startSec: startPos, endSec: startPos + durationLeft });
    if (isContinuous && currentSegmentIdx < state.segments.length - 1) {
      currentSegmentIdx++;
      playFrom(currentSegmentIdx, 0);
    }
  };
};
 
window.playSegment = function(idx) {
  stopCurrentAudio();
  if (idx === -1) {
    isContinuous = true;
    currentSegmentIdx = 0;
  } else {
    isContinuous = false;
    currentSegmentIdx = idx;
  }

  $('.recording-dot').classList.remove('paused');
  startTimer();

  playFrom(currentSegmentIdx, 0);
};
 
$('#btn-pause-resume').addEventListener('click', (e) => {
  const t = translations[currentLang];
  const span = e.currentTarget.querySelector('span');
  const txtSpan = e.currentTarget.querySelector('span:nth-child(2)') || e.currentTarget;
  if (isAudioPlaying) {
    playOffset += (state.audioContext.currentTime - playStartTime);
    stopCurrentAudio();
    txtSpan.textContent = t['btn-resume-audio'];
    e.currentTarget.style.backgroundColor = '#2ea043';
    e.currentTarget.style.color = 'white';
    if (span) span.textContent = '▶';
    pauseTimer();
    window.api.updateOverlayText("[PAUSED]");
  } else if (state.segments[currentSegmentIdx]) {
    txtSpan.textContent = t['btn-pause-audio'];
    e.currentTarget.style.backgroundColor = '#d29922';
    e.currentTarget.style.color = 'black';
    if (span) span.textContent = '⏸';
    $('.recording-dot').classList.remove('paused');
    startTimer();
    playFrom(currentSegmentIdx, playOffset);
  }
});
 
$('#btn-play-all').addEventListener('click', () => {
  const btn = $('#btn-pause-resume');
  const span = btn.querySelector('span');
  const txtSpan = btn.querySelector('span:nth-child(2)') || btn;
  txtSpan.textContent = translations[currentLang]['btn-pause-audio'];
  btn.style.backgroundColor = '#d29922';
  btn.style.color = 'black';
  if (span) span.textContent = '⏸';
  $('.recording-dot').classList.remove('paused');
  startTimer();
  playSegment(-1);
});

$('#playback-speed').addEventListener('input', (e) => {
  const speed = parseFloat(e.target.value);
  state.playbackSpeed = speed;
  $('#speed-label').textContent = speed.toFixed(1) + '×';
  if (currentAudioNode) {
    currentAudioNode.playbackRate.value = speed;
  }
});

function stopRecording(discard = false) {
  stopCurrentAudio();
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.isRecording = false;
  
  if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
    state.mediaRecorder.onstop = () => {
      if (discard) {
        renderProjects();
        showPhase('dashboard');
      } else {
        finalizeRecording();
      }
    };
    state.mediaRecorder.stop();
  } else {
    if (discard) {
      renderProjects();
      showPhase('dashboard');
    } else {
      finalizeRecording();
    }
  }
}

$('#btn-stop-recording-media').addEventListener('click', () => stopRecording(false));
$('#btn-discard-recording-media').addEventListener('click', () => {
  const msg = currentLang === 'es' ? '¿Estás seguro de que deseas descartar la grabación actual?' : 'Are you sure you want to discard the current recording?';
  const title = currentLang === 'es' ? 'Descartar Grabación' : 'Discard Recording';
  openConfirmModal(title, msg, () => {
    stopRecording(true);
  });
});

// ─── Finalize ────────────────────────────────────────────────────────────────

async function finalizeRecording() {
  const totalDuration = (performance.now() - state.recordingStartTime) / 1000;
  
  if (state.cpTimestamps.length > 0) {
    state.cpTimestamps[state.cpTimestamps.length - 1].endSec = totalDuration;
  }

  $('#done-status').innerHTML = `<p><span class="spinner"></span> ${translations[currentLang]['saving-video']}</p>`;
  showPhase('done');
  
  const blob = new Blob(state.recordedChunks, { type: 'audio/webm' });
  const arrayBuf = await blob.arrayBuffer();
  const audioBuffer = Array.from(new Uint8Array(arrayBuf));

  const res = await window.api.saveRecording({
    project: state.project,
    sprint: state.sprint,
    huName: state.selectedHu.name,
    huId: state.selectedHu.id,
    cps: state.cpTimestamps,
    timestamps: { duration: totalDuration },
    audioBuffer: audioBuffer
  });

  if (res.success) {
    $('#done-status').innerHTML = `
      <div style="margin-bottom: 20px;">${iconSuccess(40)}</div>
      <h3>${translations[currentLang]['save-success']}</h3>
      <p>File: <strong>${res.videoFile}</strong></p>
      <p>${currentLang === 'es' ? `Se registraron ${state.cpTimestamps.length} Casos de Prueba durante la narración.` : `Registered ${state.cpTimestamps.length} Test Cases during narration.`}</p>
    `;
  } else {
    $('#done-status').innerHTML = `
      <div style="margin-bottom: 20px;">${iconWarning(40)}</div>
      <h3>${translations[currentLang]['save-error']}</h3>
      <p style="color: #f85149">${res.error}</p>
    `;
  }
}

$('#btn-record-another').addEventListener('click', () => {
  renderProjects();
  showPhase('dashboard');
});



// Lang change handler
$('#lang-select').addEventListener('change', (e) => {
  currentLang = e.target.value;
  localStorage.setItem('lang', currentLang);
  applyTranslations();
  renderProjects();
  renderSprints();
  renderHus();
});

// Init
$('#lang-select').value = currentLang;
applyTranslations();

if (window.api && window.api.platform === 'win32') {
  $('#titlebar').style.display = 'flex';
} else {
  $('#titlebar').style.display = 'none';
}

// ── Exploratory Testing Variables & Logic ──
let expVideoPath = null;
let currentAnnotations = [];
let expSaveAction = null; // 'trim' or 'frame'

// Navigation
$('#btn-exploratory').addEventListener('click', async () => {
  showPhase('exploratory');
  await populateExploratoryProjects();
  renderEvidenceList();
});

$('#btn-exploratory-back').addEventListener('click', () => {
  const video = $('#exploratory-video');
  video.pause();
  $('#btn-exp-play').textContent = '▶';

  showPhase('dashboard');
  renderProjects();
  renderSprints();
  renderHus();
});

// Tab navigation
$('#tab-dashboard').addEventListener('click', () => {
  showPhase('dashboard');
  renderProjects();
  renderSprints();
  renderHus();
});

$('#tab-explorer').addEventListener('click', async () => {
  showPhase('exploratory');
  await populateExploratoryProjects();
  renderEvidenceList();
});

// Dropdown Sync
async function populateExploratoryProjects() {
  const select = $('#exp-project-select');
  select.innerHTML = '';
  const projects = await window.api.getProjects();
  projects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
  if (state.project && projects.includes(state.project)) {
    select.value = state.project;
  }
  await updateExploratorySprints();
}

async function updateExploratorySprints() {
  const project = $('#exp-project-select').value;
  const select = $('#exp-sprint-select');
  select.innerHTML = '';
  if (!project) return;
  const sprints = await window.api.getSprints(project);
  sprints.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
  if (state.sprint && sprints.includes(state.sprint)) {
    select.value = state.sprint;
  } else if (sprints.length > 0) {
    select.value = sprints[0];
  }
}

$('#exp-project-select').addEventListener('change', async () => {
  await updateExploratorySprints();
  if (!$('#modal-exploratory-save-overlay').classList.contains('hidden')) {
    await populateSaveHuDropdown();
  }
  renderEvidenceList();
});

$('#exp-sprint-select').addEventListener('change', async () => {
  if (!$('#modal-exploratory-save-overlay').classList.contains('hidden')) {
    await populateSaveHuDropdown();
  }
  renderEvidenceList();
});

// Drag & Drop / Select Video
const dragZone = $('#video-drag-zone');
dragZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragZone.classList.add('dragover');
});
dragZone.addEventListener('dragleave', () => {
  dragZone.classList.remove('dragover');
});
dragZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dragZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file && file.path) {
    loadExploratoryVideo(file.path);
  }
});
dragZone.addEventListener('click', async () => {
  const file = await window.api.selectVideoFile();
  if (file) {
    loadExploratoryVideo(file);
  }
});

function loadExploratoryVideo(filePath) {
  expVideoPath = filePath;
  const video = $('#exploratory-video');
  
  // Restore video view if in image view mode
  if (isImageViewMode) {
    isImageViewMode = false;
    currentViewGroup = null;
    currentViewMetadata = null;
    $('#exploratory-image').classList.add('hidden');
    video.classList.remove('hidden');
    $('#video-controls-panel').classList.remove('hidden');
    $('#image-controls-panel').classList.add('hidden');
    $('#btn-exp-trim-segment').classList.remove('hidden');
    $('#btn-exp-save-frame').classList.remove('hidden');
  }
  
  // Clean up previous states
  video.pause();
  video.playbackRate = 1.0;
  $('#exp-video-speed').value = 1.0;
  $('#exp-speed-val').textContent = '1.0×';
  $('#btn-exp-play').textContent = '▶';
  currentAnnotations = [];
  currentRect = null;
  renderAnnotationsList();
  redrawCanvas();
  
  // Load new video
  const resolvedPath = filePath.startsWith('file://') ? filePath : 'file:///' + filePath.replace(/\\/g, '/');
  video.src = resolvedPath;
  video.load();
  
  // UI Display
  const filename = filePath.split(/[\\/]/).pop();
  $('#lbl-video-name').textContent = filename;
  $('#loaded-video-info').classList.remove('hidden');
  
  video.onloadedmetadata = () => {
    $('#lbl-video-duration').textContent = `${translations[currentLang]['status-audio-label']} ${fmtTime(video.duration)}`;
    
    // Set slider bounds
    const maxDur = video.duration;
    $('#exp-trim-min').max = maxDur;
    $('#exp-trim-min').value = 0;
    
    $('#exp-trim-max').max = maxDur;
    $('#exp-trim-max').value = maxDur;
    
    $('#exp-video-seek').max = maxDur;
    $('#exp-video-seek').value = 0;
    
    $('#inp-trim-start').value = '00:00';
    $('#inp-trim-end').value = fmtTime(maxDur);
    
    // Enable buttons
    $('#btn-exp-trim-segment').removeAttribute('disabled');
    $('#btn-exp-save-frame').removeAttribute('disabled');
    
    updateTrimTimeline();
    setTimeout(alignCanvasWithVideo, 200);
  };
}

// ── Saved Evidence List ──
async function renderEvidenceList() {
  const project = $('#exp-project-select').value;
  const sprint = $('#exp-sprint-select').value;
  // Pick HU from the save modal dropdown if open, else try main HU selector
  const huName = $('#exp-save-hu-select')?.value || state.selectedHu?.name;

  const container = $('#evidence-list-container');
  const noEvidence = $('#lbl-no-evidence');
  container.querySelectorAll('.evidence-item').forEach(el => el.remove());

  if (!project || !sprint || !huName) {
    noEvidence.classList.remove('hidden');
    return;
  }

  const res = await window.api.listHuEvidence({ project, sprint, huName });
  if (!res.success || !res.grouped || res.grouped.length === 0) {
    noEvidence.classList.remove('hidden');
    return;
  }

  noEvidence.classList.add('hidden');

  const typeLabels = {
    bug: `${iconBug(14)} Bug`,
    feature: `${iconFeature(14)} Feature`,
    testcase: `${iconClipboard(14)} Test Case`,
    general: `${iconNote(14)} General`
  };

  res.grouped.forEach(group => {
    const item = document.createElement('div');
    item.className = 'evidence-item';

    const typeLabel = typeLabels[group.type] || group.type;
    const ts = new Date(group.timestamp);
    const timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hasVideo = !!group.video;
    const hasScreenshot = !!group.screenshot;

    let icons = '';
    if (hasVideo) icons += `<span title="Video clip">${iconClapperboard(14)}</span> `;
    if (hasScreenshot) icons += `<span title="Screenshot">${iconImage(14)}</span> `;

    let sizeStr = '';
    if (hasVideo) {
      const mb = (group.video.size / (1024 * 1024)).toFixed(1);
      sizeStr = `${mb} MB`;
    }

    item.innerHTML = `
      <div class="evidence-item-info">
        <div class="evidence-item-type">${icons} ${typeLabel}</div>
        <div class="evidence-item-meta">${timeStr} ${sizeStr ? '· ' + sizeStr : ''}</div>
      </div>
      <div class="evidence-item-actions">
        ${hasScreenshot ? `<button class="btn btn-small btn-secondary evidence-view-btn" title="View evidence">${iconEye(14)}</button>` : ''}
        ${hasVideo ? `<button class="btn btn-small btn-primary evidence-load-btn" title="Load clip into editor">▶</button>` : ''}
        <button class="btn btn-small btn-secondary evidence-delete-btn" title="Delete evidence">✕</button>
      </div>
    `;

    // View evidence
    if (hasScreenshot) {
      item.querySelector('.evidence-view-btn').addEventListener('click', () => {
        openEvidenceImageView(group);
      });
    }

    // Load video clip
    if (hasVideo) {
      item.querySelector('.evidence-load-btn').addEventListener('click', () => {
        loadSavedClip(group.video.fullPath);
      });
    }

    // Delete
    item.querySelector('.evidence-delete-btn').addEventListener('click', () => {
      const title = currentLang === 'es' ? 'Eliminar Evidencia' : 'Delete Evidence';
      const msg = currentLang === 'es' ? '¿Está seguro de que desea eliminar esta evidencia?' : 'Are you sure you want to delete this evidence?';
      openConfirmModal(title, msg, async () => {
        if (group.video) await window.api.deleteHuEvidence({ project, sprint, huName, fileName: group.video.name });
        if (group.screenshot) await window.api.deleteHuEvidence({ project, sprint, huName, fileName: group.screenshot.name });
        if (group.meta) await window.api.deleteHuEvidence({ project, sprint, huName, fileName: group.meta.name });
        renderEvidenceList();
      });
    });

    container.appendChild(item);
  });
}

function loadSavedClip(filePath) {
  loadExploratoryVideo(filePath);
}

// Evidence list refresh
$('#btn-refresh-evidence').addEventListener('click', () => renderEvidenceList());

// ── Image View Mode ──
let isImageViewMode = false;
let currentViewGroup = null;
let currentViewMetadata = null;
let selectedAnnotationColor = '#f85149';

// Color picker handlers (shared for sidebar and image controls)
document.querySelectorAll('.color-swatch').forEach(swatch => {
  swatch.addEventListener('click', (e) => {
    const color = e.target.dataset.color;
    selectedAnnotationColor = color;
    // Update active state on all swatches
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    document.querySelectorAll(`.color-swatch[data-color="${color}"]`).forEach(s => s.classList.add('active'));
  });
});

async function openEvidenceImageView(group) {
  if (!group.screenshot) return;

  currentViewGroup = group;
  const project = $('#exp-project-select').value;
  const sprint = $('#exp-sprint-select').value;
  const huName = $('#exp-save-hu-select')?.value || state.selectedHu?.name;

  // Pause video
  const video = $('#exploratory-video');
  video.pause();
  $('#btn-exp-play').textContent = '▶';

  // Switch to image view
  isImageViewMode = true;
  video.classList.add('hidden');
  $('#exploratory-image').classList.remove('hidden');
  $('#exploratory-image').src = 'file:///' + group.screenshot.fullPath.replace(/\\/g, '/');

  // Show image controls, hide video controls
  $('#video-controls-panel').classList.add('hidden');
  $('#image-controls-panel').classList.remove('hidden');

  // Hide trim/screenshot export buttons, show image actions
  $('#btn-exp-trim-segment').classList.add('hidden');
  $('#btn-exp-save-frame').classList.add('hidden');

  // Update info
  const typeLabels = { bug: `${iconBug(14)} Bug`, feature: `${iconFeature(14)} Feature`, testcase: `${iconClipboard(14)} Test Case`, general: `${iconNote(14)} General` };
  $('#image-view-info').textContent = `${typeLabels[group.type] || group.type} — ${group.screenshot.name}`;

  // Load metadata
  if (group.meta) {
    const res = await window.api.readEvidenceMeta({ project, sprint, huName, metaFileName: group.meta.name });
    if (res.success) {
      currentViewMetadata = res.metadata;
      // Load annotations into currentAnnotations (with color support)
      currentAnnotations = (res.metadata.annotations || []).map(ann => ({
        ...ann,
        color: ann.color || '#f85149'
      }));
    } else {
      currentViewMetadata = null;
      currentAnnotations = [];
    }
  } else {
    currentViewMetadata = null;
    currentAnnotations = [];
  }

  renderAnnotationsList();
  setTimeout(alignCanvasWithImage, 200);
}

function alignCanvasWithImage() {
  const img = $('#exploratory-image');
  const container = img.parentElement;
  const rect = container.getBoundingClientRect();
  if (!img.naturalWidth || !img.naturalHeight) return;
  const bounds = getVideoImageBounds(img, rect.width, rect.height);
  canvas.style.left = bounds.x + 'px';
  canvas.style.top = bounds.y + 'px';
  canvas.style.width = bounds.w + 'px';
  canvas.style.height = bounds.h + 'px';
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  redrawCanvas();
}

async function closeImageView() {
  isImageViewMode = false;
  currentViewGroup = null;
  currentViewMetadata = null;

  // Restore video view
  const video = $('#exploratory-video');
  $('#exploratory-image').classList.add('hidden');
  video.classList.remove('hidden');

  // Show video controls, hide image controls
  $('#video-controls-panel').classList.remove('hidden');
  $('#image-controls-panel').classList.add('hidden');

  // Restore export buttons
  $('#btn-exp-trim-segment').classList.remove('hidden');
  $('#btn-exp-save-frame').classList.remove('hidden');

  // Clear annotations
  currentAnnotations = [];
  currentRect = null;
  renderAnnotationsList();
  redrawCanvas();
}

// Back to video button
$('#btn-back-to-video').addEventListener('click', () => closeImageView());

// Image controls: Add annotation
$('#btn-image-add-annotation').addEventListener('click', async () => {
  const label = $('#image-annotation-input').value.trim();
  if (!label) return;

  currentAnnotations.push({
    label,
    x: 0, y: 0, w: 0, h: 0,
    color: selectedAnnotationColor
  });

  await saveImageAnnotations();
  renderAnnotationsList();
  redrawCanvas();
  $('#image-annotation-input').value = '';
});

$('#image-annotation-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('#btn-image-add-annotation').click();
});

// Image controls: Clear all
$('#btn-image-clear-annotations').addEventListener('click', async () => {
  currentAnnotations = [];
  await saveImageAnnotations();
  renderAnnotationsList();
  redrawCanvas();
});

// Image controls: Save changes
$('#btn-image-save').addEventListener('click', async () => {
  await saveImageAnnotations();
  // Show brief confirmation
  const btn = $('#btn-image-save');
  const origText = btn.textContent;
  btn.innerHTML = `${iconCheck(14)} Saved!`;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = origText;
    btn.disabled = false;
  }, 1500);
});

async function saveImageAnnotations() {
  if (!currentViewMetadata || !currentViewGroup) return;
  const project = $('#exp-project-select').value;
  const sprint = $('#exp-sprint-select').value;
  const huName = $('#exp-save-hu-select')?.value || state.selectedHu?.name;

  currentViewMetadata.annotations = currentAnnotations.map(ann => ({
    x: ann.x, y: ann.y, w: ann.w, h: ann.h,
    label: ann.label,
    color: ann.color || '#f85149'
  }));

  await window.api.updateEvidenceMeta({
    project, sprint, huName,
    metaFileName: currentViewGroup.meta.name,
    metadata: currentViewMetadata
  });
}

// Sliders and Seek Logic
function updateTrimTimeline() {
  const video = $('#exploratory-video');
  const dur = video.duration || 100;
  
  const minVal = parseFloat($('#exp-trim-min').value);
  const maxVal = parseFloat($('#exp-trim-max').value);
  
  $('#inp-trim-start').value = fmtTime(minVal);
  $('#inp-trim-end').value = fmtTime(maxVal);
  
  const highlight = $('#trim-highlight-bar');
  const leftPct = (minVal / dur) * 100;
  const widthPct = ((maxVal - minVal) / dur) * 100;
  highlight.style.left = leftPct + '%';
  highlight.style.width = widthPct + '%';
}

$('#exp-trim-min').addEventListener('input', (e) => {
  let val = parseFloat(e.target.value);
  const maxVal = parseFloat($('#exp-trim-max').value);
  if (val >= maxVal) {
    val = maxVal - 0.1;
    e.target.value = val;
  }
  updateTrimTimeline();
});

$('#exp-trim-max').addEventListener('input', (e) => {
  let val = parseFloat(e.target.value);
  const minVal = parseFloat($('#exp-trim-min').value);
  if (val <= minVal) {
    val = minVal + 0.1;
    e.target.value = val;
  }
  updateTrimTimeline();
});

$('#exp-video-seek').addEventListener('input', (e) => {
  const video = $('#exploratory-video');
  video.currentTime = parseFloat(e.target.value);
  $('#exp-current-time').textContent = fmtTime(video.currentTime);
});

// Play/Pause
$('#btn-exp-play').addEventListener('click', () => {
  const video = $('#exploratory-video');
  if (video.paused) {
    video.play();
    $('#btn-exp-play').textContent = '⏸';
  } else {
    video.pause();
    $('#btn-exp-play').textContent = '▶';
  }
});

// Playback Speed Slider Control
$('#exp-video-speed').addEventListener('input', (e) => {
  const video = $('#exploratory-video');
  const speed = parseFloat(e.target.value);
  video.playbackRate = speed;
  const speedText = speed % 1 === 0 ? speed.toFixed(1) : speed.toFixed(2);
  $('#exp-speed-val').textContent = speedText + '×';
});

// Set trim handles at current seek time
$('#btn-set-trim-start').addEventListener('click', () => {
  const video = $('#exploratory-video');
  const maxVal = parseFloat($('#exp-trim-max').value);
  let val = video.currentTime;
  if (val >= maxVal) {
    val = maxVal - 0.1;
  }
  $('#exp-trim-min').value = val;
  updateTrimTimeline();
});

$('#btn-set-trim-end').addEventListener('click', () => {
  const video = $('#exploratory-video');
  const minVal = parseFloat($('#exp-trim-min').value);
  let val = video.currentTime;
  if (val <= minVal) {
    val = minVal + 0.1;
  }
  $('#exp-trim-max').value = val;
  updateTrimTimeline();
});

// Video playback checks
const videoEl = $('#exploratory-video');
videoEl.addEventListener('timeupdate', () => {
  if (!videoEl.paused) {
    $('#exp-video-seek').value = videoEl.currentTime;
    $('#exp-current-time').textContent = fmtTime(videoEl.currentTime);
    
    // Auto-loop/stop if exceeded max trim
    const maxVal = parseFloat($('#exp-trim-max').value);
    if (videoEl.currentTime >= maxVal) {
      videoEl.pause();
      $('#btn-exp-play').textContent = '▶';
      videoEl.currentTime = parseFloat($('#exp-trim-min').value);
      $('#exp-video-seek').value = videoEl.currentTime;
    }
  }
});

// Resize window canvas sync
window.addEventListener('resize', () => {
  if (phases.exploratory.classList.contains('hidden') === false) {
    alignCanvasWithVideo();
  }
});

// Canvas drawing
const canvas = document.getElementById('annotation-canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let startX = 0, startY = 0;
let currentRect = null;

canvas.addEventListener('pointerdown', (e) => {
  if (!expVideoPath && !isImageViewMode) return;
  e.preventDefault();
  canvas.setPointerCapture(e.pointerId);
  if (!isImageViewMode) {
    videoEl.pause();
    $('#btn-exp-play').textContent = '▶';
  }

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  startX = (e.clientX - rect.left) * scaleX;
  startY = (e.clientY - rect.top) * scaleY;
  isDrawing = true;
  console.log('[Annotation] pointerdown', { startX, startY, canvasW: canvas.width, canvasH: canvas.height });
});

canvas.addEventListener('pointermove', (e) => {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const currX = (e.clientX - rect.left) * scaleX;
  const currY = (e.clientY - rect.top) * scaleY;

  const x = Math.min(startX, currX);
  const y = Math.min(startY, currY);
  const w = Math.abs(startX - currX);
  const h = Math.abs(startY - currY);

  currentRect = { x, y, w, h };

  redrawCanvas();
  ctx.strokeStyle = '#79c0ff';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
});

canvas.addEventListener('pointerup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  console.log('[Annotation] pointerup', { currentRect });
  if (currentRect && currentRect.w > 5 && currentRect.h > 5) {
    $('#annotation-details-form').classList.remove('hidden');
    $('#inp-annotation-label').value = '';
    $('#inp-annotation-label').focus();
  } else {
    currentRect = null;
    redrawCanvas();
  }
});

canvas.addEventListener('lostpointercapture', () => {
  if (isDrawing) {
    isDrawing = false;
    if (currentRect && currentRect.w > 5 && currentRect.h > 5) {
      $('#annotation-details-form').classList.remove('hidden');
      $('#inp-annotation-label').value = '';
      $('#inp-annotation-label').focus();
    } else {
      currentRect = null;
      redrawCanvas();
    }
  }
});

$('#btn-save-annotation').addEventListener('click', () => {
  const label = $('#inp-annotation-label').value.trim();
  if (label && currentRect) {
    currentAnnotations.push({
      label,
      x: Math.round(currentRect.x),
      y: Math.round(currentRect.y),
      w: Math.round(currentRect.w),
      h: Math.round(currentRect.h),
      color: selectedAnnotationColor
    });
    currentRect = null;
    $('#annotation-details-form').classList.add('hidden');
    renderAnnotationsList();
    redrawCanvas();
    // Auto-save if in image view mode
    if (isImageViewMode) saveImageAnnotations();
  }
});

$('#btn-cancel-annotation').addEventListener('click', () => {
  currentRect = null;
  $('#annotation-details-form').classList.add('hidden');
  redrawCanvas();
});

$('#btn-clear-annotations').addEventListener('click', () => {
  currentAnnotations = [];
  renderAnnotationsList();
  redrawCanvas();
  if (isImageViewMode) saveImageAnnotations();
});

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  currentAnnotations.forEach((ann) => {
    const color = ann.color || '#58a6ff';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.fillStyle = hexToRgba(color, 0.15);
    ctx.strokeRect(ann.x, ann.y, ann.w, ann.h);
    ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
    
    // Draw text bubble
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const textWidth = ctx.measureText(ann.label).width;
    ctx.fillStyle = 'rgba(13, 17, 23, 0.85)';
    ctx.fillRect(ann.x, ann.y - 25, textWidth + 16, 22);
    ctx.fillStyle = color;
    ctx.fillText(ann.label, ann.x + 8, ann.y - 9);
  });
}

function renderAnnotationsList() {
  const container = $('#annotations-list-container');
  container.innerHTML = '';
  
  if (currentAnnotations.length === 0) {
    container.innerHTML = `<span id="lbl-no-annotations" style="font-size: 12px; color: #8b949e;" data-i18n="exp-no-annotations">${translations[currentLang]['exp-no-annotations']}</span>`;
    return;
  }
  
  currentAnnotations.forEach((ann, idx) => {
    const item = document.createElement('div');
    item.className = 'annotation-item';
    
    // Color dot
    const colorDot = document.createElement('span');
    colorDot.style.cssText = `display:inline-block; width:8px; height:8px; border-radius:50%; background:${ann.color || '#58a6ff'}; margin-right:6px; flex-shrink:0;`;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'ann-text';
    textSpan.textContent = ann.label;
    
    const coordsSpan = document.createElement('span');
    coordsSpan.className = 'ann-coords';
    coordsSpan.textContent = `[${ann.x},${ann.y},${ann.w}x${ann.h}]`;
    
    const btnDel = document.createElement('button');
    btnDel.className = 'btn-icon delete';
    btnDel.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" style="display:block;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    btnDel.onclick = () => {
      currentAnnotations.splice(idx, 1);
      renderAnnotationsList();
      redrawCanvas();
      if (isImageViewMode) saveImageAnnotations();
    };
    
    item.appendChild(colorDot);
    item.appendChild(textSpan);
    item.appendChild(coordsSpan);
    item.appendChild(btnDel);
    container.appendChild(item);
  });
}

function alignCanvasWithVideo() {
  const container = videoEl.parentElement;
  const rect = container.getBoundingClientRect();
  if (!videoEl.videoWidth || !videoEl.videoHeight) return;
  const bounds = getVideoImageBounds(videoEl, rect.width, rect.height);
  canvas.style.left = bounds.x + 'px';
  canvas.style.top = bounds.y + 'px';
  canvas.style.width = bounds.w + 'px';
  canvas.style.height = bounds.h + 'px';
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  redrawCanvas();
}

function getVideoImageBounds(video, containerWidth, containerHeight) {
  const videoRatio = video.videoWidth / video.videoHeight;
  const containerRatio = containerWidth / containerHeight;
  let w, h, x, y;
  if (videoRatio > containerRatio) {
    w = containerWidth;
    h = containerWidth / videoRatio;
    x = 0;
    y = (containerHeight - h) / 2;
  } else {
    h = containerHeight;
    w = containerHeight * videoRatio;
    x = (containerWidth - w) / 2;
    y = 0;
  }
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

// Save modal action
$('#btn-exp-trim-segment').addEventListener('click', () => {
  expSaveAction = 'trim';
  openExploratorySaveModal();
});

$('#btn-exp-save-frame').addEventListener('click', () => {
  expSaveAction = 'frame';
  openExploratorySaveModal();
});

async function openExploratorySaveModal() {
  const project = $('#exp-project-select').value;
  const sprint = $('#exp-sprint-select').value;
  
  if (!project || !sprint) {
    alert(currentLang === 'es' ? 'Por favor selecciona un Proyecto y Sprint antes de exportar.' : 'Please select a Project and Sprint before exporting.');
    return;
  }
  
  // Load Project, Sprint and HUs dropdowns
  await populateSaveProjectsDropdown();
  
  // Setup display info
  const infoEl = $('#exp-save-extra-info');
  if (expSaveAction === 'trim') {
    const minVal = parseFloat($('#exp-trim-min').value);
    const maxVal = parseFloat($('#exp-trim-max').value);
    const dur = maxVal - minVal;
    infoEl.textContent = currentLang === 'es' 
      ? `Operación: Recorte de Video | Segmento: ${fmtTime(minVal)} - ${fmtTime(maxVal)} (${dur.toFixed(1)} segundos)`
      : `Operation: Video Trim | Segment: ${fmtTime(minVal)} - ${fmtTime(maxVal)} (${dur.toFixed(1)} seconds)`;
  } else {
    const curr = videoEl.currentTime;
    infoEl.textContent = currentLang === 'es'
      ? `Operación: Captura Anotada | Tiempo en video: ${fmtTime(curr)}`
      : `Operation: Annotated Screenshot | Time in video: ${fmtTime(curr)}`;
  }
  
  // Clear details
  $('#exp-save-description').value = '';
  $('#exp-new-hu-inline-container').classList.add('hidden');
  $('#exp-new-hu-input').value = '';
  
  $('#modal-exploratory-save-overlay').classList.remove('hidden');
}

async function populateSaveProjectsDropdown() {
  const select = $('#exp-save-project-select');
  select.innerHTML = '';
  const projects = await window.api.getProjects();
  projects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
  const currentProject = $('#exp-project-select').value;
  if (currentProject && projects.includes(currentProject)) {
    select.value = currentProject;
  }
  await updateSaveSprintsDropdown();
}

async function updateSaveSprintsDropdown() {
  const project = $('#exp-save-project-select').value;
  const select = $('#exp-save-sprint-select');
  select.innerHTML = '';
  if (!project) return;
  const sprints = await window.api.getSprints(project);
  sprints.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    select.appendChild(opt);
  });
  const currentSprint = $('#exp-sprint-select').value;
  if (currentSprint && sprints.includes(currentSprint)) {
    select.value = currentSprint;
  } else if (sprints.length > 0) {
    select.value = sprints[0];
  }
  await populateSaveHuDropdown();
}

async function populateSaveHuDropdown() {
  const project = $('#exp-save-project-select').value;
  const sprint = $('#exp-save-sprint-select').value;
  const select = $('#exp-save-hu-select');
  select.innerHTML = '';
  
  if (!project || !sprint) return;
  const husList = await window.api.getHus({ project, sprint });
  husList.forEach(hu => {
    const opt = document.createElement('option');
    opt.value = hu.name;
    opt.textContent = `${hu.id}: ${hu.name}`;
    select.appendChild(opt);
  });
  if (state.selectedHu && husList.some(hu => hu.id === state.selectedHu.id)) {
    select.value = state.selectedHu.name;
  }
}

// Save Modal Dropdowns Listeners
$('#exp-save-project-select').addEventListener('change', async () => {
  await updateSaveSprintsDropdown();
});

$('#exp-save-sprint-select').addEventListener('change', async () => {
  await populateSaveHuDropdown();
});

// In-line HU creation in save modal
$('#btn-exp-new-hu').addEventListener('click', () => {
  $('#exp-new-hu-inline-container').classList.remove('hidden');
  $('#exp-new-hu-input').focus();
});

$('#btn-exp-new-hu-cancel').addEventListener('click', () => {
  $('#exp-new-hu-inline-container').classList.add('hidden');
  $('#exp-new-hu-input').value = '';
});

$('#btn-exp-new-hu-save').addEventListener('click', async () => {
  const project = $('#exp-save-project-select').value;
  const sprint = $('#exp-save-sprint-select').value;
  const newName = $('#exp-new-hu-input').value.trim();
  
  if (!newName) {
    alert(currentLang === 'es' ? 'Por favor ingresa un nombre para la Historia de Usuario.' : 'Please enter a name for the User Story.');
    return;
  }
  
  let cleanName = newName;
  if (!cleanName.toUpperCase().startsWith('HU') && !cleanName.toUpperCase().startsWith('CP')) {
    cleanName = 'HU-' + cleanName;
  }
  
  const res = await window.api.createHu({ project, sprint, huName: cleanName });
  if (res.success) {
    await populateSaveHuDropdown();
    // Pre-select new HU
    $('#exp-save-hu-select').value = cleanName;
    $('#exp-new-hu-inline-container').classList.add('hidden');
    $('#exp-new-hu-input').value = '';
  } else {
    alert('Error: ' + res.error);
  }
});

$('#btn-exp-save-modal-cancel').addEventListener('click', () => {
  $('#modal-exploratory-save-overlay').classList.add('hidden');
});

$('#btn-exp-save-modal-confirm').addEventListener('click', async () => {
  const project = $('#exp-save-project-select').value;
  const sprint = $('#exp-save-sprint-select').value;
  const huName = $('#exp-save-hu-select').value;
  const findingType = $('#exp-save-type-select').value;
  const description = $('#exp-save-description').value.trim();
  
  if (!project || !sprint || !huName) {
    alert(currentLang === 'es' ? 'Por favor selecciona Proyecto, Sprint e Historia de Usuario.' : 'Please select Project, Sprint and User Story.');
    return;
  }
  
  $('#modal-exploratory-save-overlay').classList.add('hidden');
  
  // Show loading
  const doneStatus = $('#done-status');
  doneStatus.innerHTML = `<p><span class="spinner" style="display:inline-block; width:20px; height:20px; border:3px solid var(--accent-color); border-top-color:transparent; border-radius:50%; animation:spin 1s infinite linear; margin-right:10px;"></span> ${currentLang === 'es' ? 'Procesando evidencias de pruebas exploratorias...' : 'Processing exploratory testing evidence...'}</p>`;
  
  // inject spin animation style if not defined
  if (!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = '@keyframes spin { 100% { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
  
  showPhase('done');
  
  const ts = Date.now();
  const filePrefix = `exploratory_${findingType}_${ts}`;
  
  try {
    if (expSaveAction === 'trim') {
      const minVal = parseFloat($('#exp-trim-min').value);
      const maxVal = parseFloat($('#exp-trim-max').value);
      const duration = maxVal - minVal;
      const fileName = `${filePrefix}.mp4`;
      
      // Call trim-video IPC
      const trimRes = await window.api.trimVideo({
        inputPath: expVideoPath,
        project,
        sprint,
        huName,
        fileName,
        startSec: minVal,
        duration: duration
      });
      
      if (!trimRes.success) throw new Error(trimRes.error);
      
      // Save screenshot & JSON metadata linked to HU
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoEl.videoWidth;
      tempCanvas.height = videoEl.videoHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(videoEl, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw annotations on screenshot
      tempCtx.lineWidth = 4;
      tempCtx.font = 'bold 16px sans-serif';
      currentAnnotations.forEach((ann) => {
        const color = ann.color || '#58a6ff';
        const fillBg = hexToRgba(color, 0.15);
        tempCtx.strokeStyle = color;
        tempCtx.strokeRect(ann.x, ann.y, ann.w, ann.h);
        tempCtx.fillStyle = fillBg;
        tempCtx.fillRect(ann.x, ann.y, ann.w, ann.h);
        const textWidth = tempCtx.measureText(ann.label).width;
        tempCtx.fillStyle = 'rgba(13, 17, 23, 0.85)';
        tempCtx.fillRect(ann.x, ann.y - 25, textWidth + 16, 22);
        tempCtx.fillStyle = color;
        tempCtx.fillText(ann.label, ann.x + 8, ann.y - 8);
      });
      
      const base64Image = tempCanvas.toDataURL('image/png');
      
      const metaRes = await window.api.saveAnnotatedFrame({
        project,
        sprint,
        huName,
        base64Image,
        annotations: currentAnnotations,
        findingType,
        description: `[Segment: ${fmtTime(minVal)} - ${fmtTime(maxVal)}] ${description}`
      });
      
      if (!metaRes.success) throw new Error(metaRes.error);
      
      doneStatus.innerHTML = `
        <div style="margin-bottom: 20px;">${iconSuccess(40)}</div>
        <h3>${currentLang === 'es' ? 'Recorte Guardado Correctamente' : 'Trim Saved Successfully'}</h3>
        <p>Video segment: <strong>${fileName}</strong></p>
        <p>Annotations: <strong>${metaRes.jsonName}</strong></p>
        <p>Screenshot: <strong>${metaRes.pngName}</strong></p>
      `;
      $('#btn-exp-continue-editing').classList.remove('hidden');
    } else {
      // frame only action
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoEl.videoWidth;
      tempCanvas.height = videoEl.videoHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(videoEl, 0, 0, tempCanvas.width, tempCanvas.height);
      
      // Draw annotations on screenshot
      tempCtx.lineWidth = 4;
      tempCtx.font = 'bold 16px sans-serif';
      currentAnnotations.forEach((ann) => {
        const color = ann.color || '#58a6ff';
        const fillBg = hexToRgba(color, 0.15);
        tempCtx.strokeStyle = color;
        tempCtx.strokeRect(ann.x, ann.y, ann.w, ann.h);
        tempCtx.fillStyle = fillBg;
        tempCtx.fillRect(ann.x, ann.y, ann.w, ann.h);
        const textWidth = tempCtx.measureText(ann.label).width;
        tempCtx.fillStyle = 'rgba(13, 17, 23, 0.85)';
        tempCtx.fillRect(ann.x, ann.y - 25, textWidth + 16, 22);
        tempCtx.fillStyle = color;
        tempCtx.fillText(ann.label, ann.x + 8, ann.y - 8);
      });
      
      const base64Image = tempCanvas.toDataURL('image/png');
      
      const metaRes = await window.api.saveAnnotatedFrame({
        project,
        sprint,
        huName,
        base64Image,
        annotations: currentAnnotations,
        findingType,
        description: `[Timestamp: ${fmtTime(videoEl.currentTime)}] ${description}`
      });
      
      if (!metaRes.success) throw new Error(metaRes.error);
      
      doneStatus.innerHTML = `
        <div style="margin-bottom: 20px;">${iconSuccess(40)}</div>
        <h3>${currentLang === 'es' ? 'Captura Guardada Correctamente' : 'Screenshot Saved Successfully'}</h3>
        <p>Annotations: <strong>${metaRes.jsonName}</strong></p>
        <p>Screenshot: <strong>${metaRes.pngName}</strong></p>
      `;
      $('#btn-exp-continue-editing').classList.remove('hidden');
    }
  } catch (err) {
    console.error('Error saving exploratory evidence:', err);
    $('#btn-exp-continue-editing').classList.add('hidden');
    doneStatus.innerHTML = `
      <div style="margin-bottom: 20px;">${iconWarning(40)}</div>
      <h3>${currentLang === 'es' ? 'Error al procesar' : 'Error in processing'}</h3>
      <p style="color: #f85149">${err.message}</p>
    `;
  }
});

// Continue Editing → back to exploratory workspace
$('#btn-exp-continue-editing').addEventListener('click', async () => {
  $('#btn-exp-continue-editing').classList.add('hidden');
  showPhase('exploratory');
  await renderEvidenceList();
});

// Hide continue button when going back to home
$('#btn-record-another').addEventListener('click', () => {
  $('#btn-exp-continue-editing').classList.add('hidden');
});

// ── Detached Window: Tab Detach Handlers ────────────────────────────────────
$$('.tab-detach').forEach(icon => {
  icon.addEventListener('click', async (e) => {
    e.stopPropagation();
    const tabId = icon.dataset.detach;
    await window.api.createDetachedView(tabId);

    // Hide the detached tab in main window and switch to the other view
    $(`#tab-${tabId}`).classList.add('hidden');
    const otherTab = tabId === 'exploratory' ? 'dashboard' : 'exploratory';
    showPhase(otherTab);
    if (otherTab === 'dashboard') {
      renderProjects();
      renderSprints();
      renderHus();
    }
  });
});

// When a detached window is closed, restore its tab in the main window
window.api.onTabDetachedClosed(({ tabId }) => {
  $(`#tab-${tabId}`).classList.remove('hidden');
});

// ── Sidebar Toggle (Hamburger Menu) ────────────────────────────────────────
$('#btn-sidebar-toggle').addEventListener('click', () => {
  $('#sidebar-canvas').classList.toggle('collapsed');
});

// ── Init ────────────────────────────────────────────────────────────────────
if (isDetachedWindow) {
  // Detached window: hide tabs bar, sidebar actions, show only the assigned view
  $('#view-tabs').classList.add('hidden');
  $('#sidebar-canvas').classList.add('hidden');
  document.querySelector('header').classList.add('hidden');

  if (detachedView === 'exploratory') {
    showPhase('exploratory');
    populateExploratoryProjects().then(() => renderEvidenceList());
  } else {
    showPhase('dashboard');
    renderProjects();
    renderSprints();
    renderHus();
  }
} else {
  // Main window: normal init
  renderProjects();
  showPhase('dashboard');
}
