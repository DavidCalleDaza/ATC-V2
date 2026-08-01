# Instalación en Windows + WSL (Opción Híbrida)

Electron corre nativamente en Windows con diálogos nativos.
Python, Piper TTS, ffmpeg y tesseract corren dentro de WSL Ubuntu.

---

## Requisitos previos

### 1. WSL (Windows Subsystem for Linux)

```powershell
# PowerShell como Administrador
wsl --install -d Ubuntu
wsl --set-default-version 2
```

Reiniciar el PC y abrir Ubuntu desde el menú Inicio para terminar la configuración.

### 2. Node.js (Windows)

Descargar e instalar desde https://nodejs.org (LTS, v18+)

### 3. Git (Windows)

```powershell
winget install Git.Git
```

---

## Setup en WSL (Ubuntu)

Abrir la terminal de Ubuntu y ejecutar:

```bash
# Clonar el proyecto en WSL
cd ~
git clone https://github.com/DavidCalleDaza/ATC-V2.git
cd ATC-V2

# Dependencias del sistema
sudo apt update
sudo apt install -y ffmpeg tesseract-ocr tesseract-ocr-spa python3.11-venv python3-pip libnspr4 libnss3

# Entorno virtual Python
python3.11 -m venv venv
source venv/bin/activate

# Dependencias Python
pip install -r requirements.txt
pip install piper-tts

# Modelo de voz español
cd recorder
mkdir -p tts-models tts-cache
curl -L -o tts-models/es_ES-sharvard-medium.onnx \
  https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx
curl -L -o tts-models/es_ES-sharvard-medium.onnx.json \
  https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium/es_ES-sharvard-medium.onnx.json

# Copiar .env
cp .env.example .env
```

---

## Setup en Windows (Electron)

```powershell
# Acceder al proyecto desde WSL
cd \\wsl.localhost\Ubuntu\home\TU_USUARIO\ATC-V2\recorder

# O si tienes la unidad montada:
# cd Z:\home\TU_USUARIO\ATC-V2\recorder

# Instalar dependencias Node
npm install

# Ejecutar la app
npm start
```

La app detecta automáticamente que está en Windows con archivos en WSL
y ejecuta los comandos Python via `wsl.exe`.

---

## Verificación

1. El Electron app se abre con interfaz Windows nativa
2. Los diálogos de archivo son los nativos de Windows
3. Al generar audio guide, Electron llama a `wsl.exe` que ejecuta Python en WSL
4. Los archivos se guardan en la carpeta `projects/` dentro de WSL

---

## Empaquetar para distribución

```powershell
# En la carpeta recorder (Windows)
npm install electron-builder --save-dev
npm run build:win
```

El ejecutable portable se genera en `recorder/dist/`.

---

## Estructura de archivos

```
Windows (C:\Users\...)
└── Electron app (nativo) → diálogos Windows, grabación de pantalla

WSL Ubuntu (\\wsl.localhost\Ubuntu\home\USER\ATC-V2)
├── venv/              ← Python + dependencias
├── main.py            ← CLI unificado
├── src/               ← Backend (motores locales)
├── recorder/
│   ├── main.js        ← Electron main process
│   ├── tts-models/    ← Modelo de voz Piper
│   └── tts-cache/     ← Cache TTS
└── projects/          ← Datos del proyecto (Excels, plantillas, evidencias)
```

---

## Notas

- Los archivos del proyecto viven en WSL para que Python pueda accederlos
- Electron usa `wsl.exe -d Ubuntu -- bash -c "python3 main.py ..."` para comandos
- La captura de pantalla usa las APIs nativas de Windows (DirectX/WGC)
- Si hay error `E_ACCESSDENIED`, ejecutar Electron como Administrador
- Para desarrollo: `npm start` en Windows, `python main.py --help` en WSL
