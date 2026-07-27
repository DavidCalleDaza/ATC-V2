# Análisis Completo del Sistema "automatic-test-case"

> **Última actualización**: 2026-07-27
> Este documento refleja el estado REAL del sistema, verificado mediante inspección directa del código fuente.

---

## 1. PROPÓSITO DEL SISTEMA

Sistema de **generación automatizada de evidencias de prueba** para equipos de QA. Combina dos grandes componentes:

1. **Electron Recorder** (`recorder/`): Aplicación de escritorio para grabar evidencias sincronizadas (video + audio narrado + trazabilidad de CPs).
2. **Python Backend** (`src/` + `main.py`): Generación de audio-guías narradas (TTS), escaneo dinámico de proyectos, y motor de análisis de video (OCR/IA).
3. **Pipeline legacy** (`cmd evidence`, `cmd create-suite`): Generación de documentos Word con evidencia insertada — **ROTO por migración incompleta**.

---

## 2. ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────────────────┐
│                         main.py (CLI Entry Point)                  │
│  Subcomandos: audio-guide | evidence(BROKEN) | create-suite(BROKEN)│
└────────┬──────────────────────────────────────────────┬─────────────┘
         │                                              │
         ▼                                              ▼
┌─────────────────────┐                  ┌──────────────────────────┐
│    src/ (Python)    │                  │  recorder/ (Electron)    │
│  Módulos refactoriz.│                  │  App de grabación        │
└────────┬────────────┘                  └────────────┬─────────────┘
         │                                            │
    ┌────┴──────────────────────┐             ┌───────┴──────────┐
    │                           │             │                  │
    ▼                           ▼             ▼                  ▼
┌──────────────┐  ┌──────────────────┐  ┌──────────────┐  ┌───────────┐
│ src/data/    │  │ src/engines/     │  │ renderer.js  │  │ main.js   │
│ - excel_read │  │ - local/ (OCR,   │  │ (2562 líneas │  │ (IPC main │
│ - story_scan │  │   TTS, Whisper,  │  │  monolítico) │  │  process) │
│ - config_mgr │  │   frame_extract, │  └──────────────┘  └───────────┘
│ - project_mgr│  │   image_dedup)   │
└──────────────┘  │ - ai/ (Gemini,   │
                  │   ai_annotator)  │
                  └──────────────────┘
```

---

## 3. FLUJO DE DATOS

### 3.1 Pipeline Principal — Audio Guide (`cmd audio-guide`)

```
 1. User stories/ o projects/ → story_scanner.py escanea sprints y HUs
 2. excel_reader.py lee Excel (hoja DiseñoEjecución, header fila 6)
    → Filtra CPs positivos (heurística de patrones negativos)
 3. audio_guide.py genera guión narrativo (.md):
    - Usa Gemini API (si hay API key) para humanizar texto
    - Fallback: plantilla conversacional en español
 4. tts_engine.py (Piper TTS local) genera audio (.wav):
    - Cache MD5 para no regenerar textos idénticos
    - Concatenación con ffmpeg
 5. Se guarda metadata de duraciones (.json) para sincronización con UI
```

### 3.2 Electron Recorder (Grabación Sincronizada)

```
 1. Dashboard: CRUD de Proyectos/Sprints/HUs vía IPC → sistema de archivos
 2. Audio Guide Phase: llama a Python via runPythonCommand() para generar audio
 3. Selección de Región: desktopCapturer → preview + crop box interactivo
 4. Grabación:
    - ffmpeg graba pantalla (gdigrab en Windows, x11grab en Linux)
    - Web Audio API reproduce audio narrado con sync de segmentos
    - Overlay flotante con texto del paso actual + controles
    - MediaRecorder captura audio dinámico (voz del QA)
 5. Finalización:
    - ffmpeg mux: video + audio dinámico → evidence_HU-XXXX_final.mp4
    - Genera trazabilidad.json con timestamps por CP
```

### 3.3 Pipeline Legacy — Evidencia Word (`cmd evidence`) — ROTO

```
 El código en main.py:cmd_evidence importa módulos que YA NO EXISTEN:
   from core.excel_parser import ...
   from core.image_processor import ...
   from core.docx_generator import ...
 
 Los directorios core/ y scripts/ fueron eliminados durante la migración a src/.
 Este subcomando falla al ejecutarse.
```

---

## 4. ESTRUCTURA DE DIRECTORIOS (REAL)

```
automatic-test-case/
├── main.py                          ← Entry point CLI (256 lines)
├── analisis-sistema.md              ← Este archivo
├── implementation-plan.md           ← Plan de implementación parcialmente obsoleto
├── .env                             ← API key de Gemini (protegido por .gitignore)
├── .gitignore                       ← Protege: venv, .env, media, docs, etc.
├── .python-version                  ← Python 3.11.9
├── generacion_evidencias.log        ← Log de ejecución
│
├── config/
│   ├── settings.json                ← LEGACY: mapeo HU → ruta (obsoleto, apunta a user_stories/)
│   └── trazabilidad.json            ← LEGACY: rangos de frames por CP (incompleto: solo 5 HUs)
│
├── src/                             ← Backend Python refactorizado
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── excel_reader.py          ← Lectura de Excel + filtrado heurístico de CPs (180 lines)
│   │   ├── story_scanner.py         ← Escaneo dinámico de projects/ (147 lines)
│   │   ├── config_manager.py        ← Carga centralizada de settings/trazabilidad (106 lines)
│   │   └── project_manager.py       ← CRUD de carpetas projects/ (116 lines)
│   ├── engines/
│   │   ├── __init__.py
│   │   ├── local/
│   │   │   ├── __init__.py
│   │   │   ├── tts_engine.py        ← Piper TTS local + cache MD5 (237 lines)
│   │   │   ├── frame_extractor.py   ← Extracción de frames con ffmpeg (95 lines)
│   │   │   ├── ocr_engine.py        ← OCR con pytesseract + OpenCV (122 lines)
│   │   │   ├── whisper_engine.py    ← Transcripción Whisper local (75 lines)
│   │   │   └── image_dedup.py       ← Deduplicación MD5 + MSE (131 lines)
│   │   └── ai/
│   │       ├── __init__.py
│   │       ├── gemini_analyzer.py   ← Análisis de video con Gemini API (155 lines)
│   │       └── ai_annotator.py      ← Dibujado de bounding boxes (101 lines)
│   ├── generators/
│   │   ├── __init__.py
│   │   └── audio_guide.py           ← Generador de audio-guías (347 lines) ← MÓDULO MÁS COMPLETO
│   └── orchestrators/
│       └── __init__.py              ← VACÍO — no hay orquestación implementada
│
├── recorder/                        ← Aplicación Electron (Screen Recorder)
│   ├── package.json                 ← antigravity-recorder v1.0.0 (Electron 43)
│   ├── main.js                      ← Main process + IPC handlers (1214 lines)
│   ├── preload.js                   ← Context bridge API (36 lines)
│   ├── setup.sh                     ← Setup: Node, ffmpeg, Piper TTS, modelo de voz
│   ├── renderer/
│   │   ├── index.html               ← UI completa (528 lines)
│   │   ├── renderer.js              ← Frontend monolítico (2562 lines)
│   │   ├── styles.css               ← Estilos dark theme
│   │   └── styles.css.partial       ← Estilos parciales (no referenciado)
│   ├── assets/                      ← Iconos de la app
│   ├── tts-models/                  ← Modelos Piper TTS (.onnx) — gitignored
│   ├── tts-cache/                   ← Cache de audio generado
│   ├── recordings/                  ← Grabaciones temporales
│   └── node_modules/                ← Dependencias Node
│
├── projects/                        ← Sistema de archivos actual
│   └── cecoban/
│       └── sprint-02/
│           ├── CP_HU-6680 Consultar Plantillas de Eventos/
│           ├── CP_HU-6682 Crear Plantilla de Evento/
│           ├── CP_HU-6686 Editar Plantilla de Evento/
│           ├── CP_HU-6687 Consultar Diagrama de Flujo/
│           ├── CP_HU-6688 Descargar Diagrama de Flujo PNG/
│           ├── CP_HU-6689 Descargar Diagrama de Flujo PDF/
│           ├── CP_HU-6699 Crear Activo Expirable/
│           ├── CP_HU-6702 Editar Activo Expirable/
│           ├── CP_HU-6704 Consultar Flujo de Renovación/
│           ├── CP_HU-7036 Consultar perfiles/
│           ├── CP_HU-7037 Buscar y Filtrar Perfiles/
│           ├── CP_HU-7038 Crear perfil/
│           ├── CP_HU-7039 Editar perfil/
│           └── CP_HU-7042 Inhabilitar perfil/
│
├── audio_guides/                    ← Audio-guías generadas (también en HU folders)
│   ├── CECOBAN/
│   └── sprint-02/
│
├── tests/                           ← Tests de verificación (NO automatizados)
│   ├── test_audio_guide_smoke.py    ← Smoke test manual de audio guide
│   └── test_data_layer.py           ← Smoke test manual de data layer
│
├── experiments/                     ← Scripts de prueba y análisis
│   ├── test_combined_match.py
│   ├── test_dedup_methods.py
│   ├── check_dedup.py
│   ├── test_stopwords.py / test_stopwords2.py
│   ├── parse_log.py
│   ├── test_ranking_full_table.py
│   ├── compare_matching.py
│   ├── test_ranking.py / test_ranking_pasos.py
│   ├── check_excel_columns.py
│   ├── check_traceability.py
│   └── test_monotonic_fuzzy.py
│
├── mapping_data/                    ← Datos de mapeo intermedios
│   ├── image_map.json
│   ├── duplicates_report.json
│   └── (archivos .xlsx excluidos por .gitignore)
│
└── venv/                            ← Virtual environment (gitignored)
```

---

## 5. TECH STACK

| Capa | Tecnología | Uso |
|---|---|---|
| **Backend** | Python 3.11.9 | Orquestación, generación de audio, análisis |
| **Frontend** | Electron 43 + Vanilla JS | App de escritorio, grabación sincronizada |
| **TTS** | Piper TTS (offline) | Generación de audio narrado localmente |
| **OCR** | pytesseract + OpenCV | Extracción de texto de screenshots |
| **Transcripción** | openai-whisper | Transcripción de audio de videos |
| **IA** | Google Gemini 2.0 Flash | Humanización de narrativa + análisis de video |
| **Video** | ffmpeg | Extracción frames, mux audio/video, recorte |
| **Documentos** | python-docx, openpyxl | Manipulación Word y Excel |
| **Matching** | thefuzz (token_set_ratio) | Fuzzy matching de CPs contra OCR |
| **Dedup** | Pillow + numpy + imagehash | Deduplicación de frames por MD5/MSE |

### Dependencias Python (no declaradas formalmente)
No existe `requirements.txt` ni `pyproject.toml`. Dependencias inferidas:
- `pandas`, `openpyxl`, `python-docx`, `google-genai`, `opencv-python-headless`
- `pytesseract`, `Pillow`, `numpy`, `imagehash`, `thefuzz`, `openai-whisper`

### Dependencias Node.js
- `electron` ^43.2.0 (devDependency)
- `xlsx` ^0.18.5 (dependency)
- `adm-zip` (usado en main.js, instalado vía npm)

---

## 6. MODELO DE DATOS

### Entidades principales

| Entidad | Descripción | Ubicación |
|---|---|---|
| **Proyecto** | Contenedor de sprints | `projects/{nombre}/` |
| **Sprint** | Iteración del proyecto | `projects/{proyecto}/sprint-XX/` |
| **HU** (Historia de Usuario) | User story individual | `projects/{proyecto}/sprint-XX/CP_HU-XXXX nombre/` |
| **CP** (Caso de Prueba) | Test case definido en Excel | Dentro del Excel de la HU |
| **Audio Guide** | Narración TTS del guión | `{hu_folder}/{hu_id}_guide.wav` + `.md` + `.json` |
| **Evidencia** | Video grabado + metadata | `{hu_folder}/evidence_{hu_id}_{timestamp}.mp4` |
| **Finding** | Hallazgo exploratorio | `{hu_folder}/finding_{type}_{timestamp}.{png,json,mp4}` |

### Relaciones

```
Proyecto 1→N Sprint
Sprint 1→N HU
HU 1→N CP (definido en Excel DiseñoEjecución)
HU 1→1 Audio Guide (.wav + .md + .json de duraciones)
HU 1→N Evidencias (.mp4 grabados)
HU 1→N Findings (hallazgos exploratorios)
```

### Archivos de configuración

**config/settings.json** — LEGACY, obsoleto:
```json
{
    "base_dir": ".",
    "video_dir": "video",
    "map_file": "mapa_imagenes.json",
    "hu_folders": {
        "HU-6680": "user_stories/sprint-02/CP_HU-6680 ...",
        ...
    }
}
```
Problema: apunta a `user_stories/sprint-02/` pero los datos están en `projects/cecoban/sprint-02/`.

**config/trazabilidad.json** — LEGACY, incompleto:
- Solo cubre 5 HUs: 6680, 6682, 6686, 6687, 6688, 6689
- Faltan: 6699, 6702, 6704, 7036, 7037, 7038, 7039, 7042
- Formato: rangos de tiempo [inicio, fin] por CP

---

## 7. HALLAZGOS CRÍTICOS

### 7.1 Comandos rotos en main.py

**`cmd evidence`** (líneas 82-149): Importa de `core.excel_parser`, `core.image_processor`, `core.docx_generator` — módulos que **no existen**. El directorio `core/` fue eliminado.

**`cmd create_suite`** (líneas 154-168): Importa de `scripts.create_suite_folders` — también inexistente.

**Solo funcionan**: `audio-guide` (usa `src/`) y `recorder` (usa Electron).

### 7.2 Dualidad de sistemas de archivos

El sistema tiene dos modelos de datos paralelos no reconciliados:
- **Legacy** (`settings.json`): `user_stories/sprint-02/CP_HU-XXXX` — referenciado por `cmd evidence`
- **Actual** (`story_scanner.py` + Electron): `projects/{project}/sprint-XX/CP_HU-XXXX`

### 7.3 `list_existing_guides()` busca en ubicación equivocada

En `src/generators/audio_guide.py:331-347`, busca guías en `audio_guides/{sprint}/` pero las guías se generan en `projects/{project}/{sprint}/{hu_folder}/`. La función `--list` del CLI retorna resultados vacíos o incorrectos.

### 7.4 Renderer.js monolítico (2,562 líneas)

Un solo archivo maneja: CRUD de proyectos, grabación de pantalla, sync de audio, exploratory testing, canvas de anotaciones, internacionalización, modales. Dificulta testing, mantenimiento y colaboración.

### 7.5 Seguridad en ventana overlay

`recorder/main.js:708-710` configura la ventana overlay con:
```javascript
webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
}
```
Esto permite ejecución arbitraria de Node.js desde el contexto de la página. Es aceptable solo porque el HTML se genera internamente (línea 715-1000), pero es un riesgo si se modifica en el futuro.

### 7.6 Tests no automatizados

Los archivos `tests/test_audio_guide_smoke.py` y `tests/test_data_layer.py` son scripts de verificación manual (print statements, sin assertions). No hay framework de testing configurado.

### 7.7 `test_data_layer.py` tiene BASE_DIR incorrecto

`tests/test_data_layer.py:6` define `BASE_DIR = Path(__file__).parent` que apunta a `tests/`, no a la raíz del proyecto. `scan_sprints(BASE_DIR)` no encuentra `projects/`.

### 7.8 implementation-plan.md parcialmente obsoleto

- Items 2.2-2.4 (speed slider UI/lógica/estilos) marcados pendientes pero **ya implementados** en renderer.js:1361 y index.html:354-359
- Item 3.1 (voz es_MX-claude-high.onnx) no implementado; `setup.sh` usa `es_ES-sharvard-medium`
- Items completados (1.1, 1.2, 2.1) correctamente marcados

### 7.9 `recorder/renderer/styles.css.partial` huérfano

No existe en la estructura de archivos activa. Probablemente un artefacto de refactorización parcial.

---

## 8. MÓDULOS POR ESTADO DE MADUREZ

### Funcional y completo
| Módulo | Archivo | Líneas | Estado |
|---|---|---|---|
| Audio Guide Generator | `src/generators/audio_guide.py` | 347 | ✅ Funcional |
| Excel Reader | `src/data/excel_reader.py` | 180 | ✅ Funcional |
| Story Scanner | `src/data/story_scanner.py` | 147 | ✅ Funcional |
| Config Manager | `src/data/config_manager.py` | 106 | ✅ Funcional |
| Project Manager | `src/data/project_manager.py` | 116 | ✅ Funcional |
| Piper TTS Engine | `src/engines/local/tts_engine.py` | 237 | ✅ Funcional |
| Frame Extractor | `src/engines/local/frame_extractor.py` | 95 | ✅ Funcional |
| OCR Engine | `src/engines/local/ocr_engine.py` | 122 | ✅ Funcional |
| Whisper Engine | `src/engines/local/whisper_engine.py` | 75 | ✅ Funcional |
| Image Dedup | `src/engines/local/image_dedup.py` | 131 | ✅ Funcional |
| Gemini Analyzer | `src/engines/ai/gemini_analyzer.py` | 155 | ✅ Funcional |
| AI Annotator | `src/engines/ai/ai_annotator.py` | 101 | ✅ Funcional |
| Electron Recorder | `recorder/` (completo) | ~5000 | ✅ Funcional |

### Roto / Inoperable
| Módulo | Archivo | Problema |
|---|---|---|
| `cmd evidence` | `main.py:82-149` | Importa `core.*` que no existe |
| `cmd create-suite` | `main.py:154-168` | Importa `scripts.*` que no existe |
| `config/settings.json` | `config/settings.json` | Apunta a rutas legacy (`user_stories/`) |
| `config/trazabilidad.json` | `config/trazabilidad.json` | Solo 5 de 14 HUs definidas |

### Vacío / Sin implementar
| Módulo | Archivo | Estado |
|---|---|---|
| Orchestrators | `src/orchestrators/__init__.py` | Vacío — sin lógica de orquestación |

---

## 9. MAPA DE ARCHIVOS POR FUNCIÓN

### Backend Python (src/)
| Archivo | Líneas | Rol |
|---|---|---|
| `main.py` | 256 | CLI orquestador (4 subcomandos) |
| `src/data/excel_reader.py` | 180 | Lectura Excel + filtrado heurístico |
| `src/data/story_scanner.py` | 147 | Escaneo dinámico de `projects/` |
| `src/data/config_manager.py` | 106 | Carga de settings.json y trazabilidad.json |
| `src/data/project_manager.py` | 116 | CRUD de carpetas de proyectos |
| `src/generators/audio_guide.py` | 347 | Generación de guiones + audio |
| `src/engines/local/tts_engine.py` | 237 | Piper TTS + cache + concatenación |
| `src/engines/local/frame_extractor.py` | 95 | Extracción frames con ffmpeg |
| `src/engines/local/ocr_engine.py` | 122 | OCR con pytesseract |
| `src/engines/local/whisper_engine.py` | 75 | Transcripción Whisper |
| `src/engines/local/image_dedup.py` | 131 | Deduplicación de frames |
| `src/engines/ai/gemini_analyzer.py` | 155 | Análisis video con Gemini |
| `src/engines/ai/ai_annotator.py` | 101 | Dibujado bounding boxes |

### Frontend Electron (recorder/)
| Archivo | Líneas | Rol |
|---|---|---|
| `recorder/main.js` | 1214 | Main process, IPC, ffmpeg, overlay |
| `recorder/preload.js` | 36 | Context bridge API |
| `recorder/renderer/index.html` | 528 | Estructura UI completa |
| `recorder/renderer/renderer.js` | 2562 | Frontend lógica (monolítico) |
| `recorder/renderer/styles.css` | — | Estilos dark theme |
| `recorder/setup.sh` | 88 | Setup automatizado de dependencias |

---

## 10. RECOMENDACIONES PRIORIZADAS

### Críticas (sistema no funcional)
1. **Eliminar `cmd evidence` y `cmd create-suite`** de main.py, o restaurar los módulos `core/` necesarios. Actualmente son dead code que confunde.
2. **Actualizar `config/settings.json`** para apuntar a `projects/cecoban/sprint-02/` si se necesita el pipeline legacy, o eliminarlo.
3. **Corregir `list_existing_guides()`** en audio_guide.py para buscar en `projects/{project}/{sprint}/{hu}/`.

### Importantes
4. **Crear `requirements.txt`** con todas las dependencias Python declaradas.
5. **Corregir `tests/test_data_layer.py`** — `BASE_DIR` debe apuntar a la raíz del proyecto, no a `tests/`.
6. **Refactorizar `renderer.js`** en módulos separados (dashboard, recording, exploratory, canvas).
7. **Reconciliar modelos de datos** — unificar `user_stories/` vs `projects/`.
8. **Limpiar `implementation-plan.md`** — marcar items completados realmente.

### Mejoras
9. **Implementar tests automatizados** con pytest para `src/data/` y `src/engines/`.
10. **Completar trazabilidad.json** para las 8 HUs faltantes.
11. **Agregar orchestrator** que conecte los motores (OCR + Whisper + Gemini) en un pipeline unificado.
12. **Eliminar `recorder/renderer/styles.css.partial`** (huérfano).
