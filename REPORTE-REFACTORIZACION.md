# Reporte de Refactorización — ATC-V2

**Fecha:** 2026-07-31
**Objetivo:** Desacoplar el backend en dos motores independientes (local / cloud) y eliminar la dependencia directa de Gemini del código funcional.

---

## 1. Nueva Arquitectura: Strategy Pattern con Engine Registry

```
src/engines/
├── base.py                 Interfases abstractas (NarrationEngine, VideoAnalyzer, CpDetection)
├── registry.py             Factory — selecciona motores según ATC_BACKEND (local|cloud)
├── local/                  Backend 100% offline — default
│   ├── narration.py        Narración con plantillas conversacionales en español
│   ├── tts_engine.py       Piper TTS
│   ├── ocr_engine.py       pytesseract
│   ├── whisper_engine.py   OpenAI Whisper (local)
│   ├── frame_extractor.py  ffmpeg frame extraction
│   └── image_dedup.py      MD5 + MSE deduplication
└── cloud/                  Backend cloud — arquitectura lista, no activo
    ├── gemini_narration.py  Narración humanizada con Gemini 2.0 Flash
    ├── gemini_analyzer.py   Análisis de video con Gemini (heredado, no conectado a pipeline)
    └── ai_annotator.py      Dibujo de bounding boxes con OpenCV
```

**Selección de backend:** variable de entorno `ATC_BACKEND`

```bash
ATC_BACKEND=local   # 100% offline, sin APIs externas (default)
ATC_BACKEND=cloud   # requiere GEMINI_API_KEY + google-genai
```

Si `ATC_BACKEND=cloud` pero no hay API key, **degrada automáticamente a local**.

---

## 2. Archivos Creados

| Archivo | Descripción | Líneas |
|---|---|---|
| `src/engines/base.py` | Interfaces abstractas `NarrationEngine`, `VideoAnalyzer`, dataclass `CpDetection` | 66 |
| `src/engines/registry.py` | Factory con `get_narration_engine()`, `get_video_analyzer()`, `get_backend()` | 62 |
| `src/engines/local/narration.py` | `LocalNarrationEngine` — plantillas conversacionales (extraído de audio_guide.py) | 64 |
| `src/engines/cloud/__init__.py` | Docstring del backend cloud | 9 |
| `src/engines/cloud/gemini_narration.py` | `GeminiNarrationEngine` — implementación cloud con fallback a local | 87 |

## 3. Archivos Modificados

| Archivo | Cambio |
|---|---|
| `audio_guide.py` | Eliminados `_get_fallback_conversational_text()` y `_generate_humanized_text()`. Ahora usa `self.narration.generate(tc, i)` vía registry. **Cero imports de Gemini.** |
| `requirements.txt` | `google-genai>=0.3` comentado como opcional (solo cloud) |
| `.env.example` | Agrega `ATC_BACKEND=local` como nueva variable |
| `src/engines/__init__.py` | Docstring actualizado con guía de uso del registry |
| `src/engines/local/__init__.py` | Docstring con listado de motores locales |
| `src/engines/cloud/gemini_analyzer.py` | Importa `VideoAnalyzer` y `CpDetection` de `base.py`. Agrega método `analyze()` para cumplir interfaz. Eliminado dataclass duplicado. |
| `src/engines/cloud/ai_annotator.py` | Docstring corregido (ya no menciona Gemini como dependencia) |
| `recorder/setup.sh` | Corregidos terminadores de línea CRLF → LF (causaba error `pipefail: invalid option`) |

## 4. Archivos Eliminados

| Archivo | Motivo |
|---|---|
| `src/engines/ai/` (directorio completo) | Renombrado a `src/engines/cloud/` para consistencia con `local/` |

## 5. Instalación Realizada

| Componente | Comando | Resultado |
|---|---|---|
| Python venv (3.11.15) | `python3.11 -m venv venv` | Creado |
| Dependencias Python | `pip install -r requirements.txt` | Instalado (pandas, openpyxl, python-docx, pytesseract, opencv-python, Pillow, numpy, imagehash, thefuzz, sentence-transformers, openai-whisper) |
| Piper TTS | `pip install piper-tts` | Instalado v1.6.0 |
| Modelo voz español | `curl` desde HuggingFace | Descargado `es_ES-sharvard-medium.onnx` (74 MB) |
| Dependencias Node | `cd recorder && npm install` | Instalado (electron, adm-zip, xlsx) |
| `.env` | Copiado de `.env.example` | `ATC_BACKEND=local` |

## 6. Pendientes (requieren sudo)

| Componente | Comando |
|---|---|
| ffmpeg | `sudo apt install -y ffmpeg` |
| Tesseract OCR + español | `sudo apt install -y tesseract-ocr tesseract-ocr-spa` |
| Librerías Electron | `sudo apt install -y libnspr4 libnss3` |

**Comando único para instalar todo lo pendiente:**

```bash
sudo apt install -y ffmpeg tesseract-ocr tesseract-ocr-spa libnspr4 libnss3
```

## 7. Verificaciones

| Prueba | Resultado |
|---|---|
| `python main.py --help` | Funciona (4 subcomandos) |
| `python main.py audio-guide --help` | Funciona |
| `python main.py evidence-v2 --help` | Funciona |
| Import `src.engines.base` | OK |
| Import `src.engines.registry` | OK |
| `get_narration_engine()` → `LocalNarrationEngine` | OK |
| `ATC_BACKEND=cloud` → degrada a local sin API key | OK |
| `ATC_BACKEND=cloud` → `get_video_analyzer()` retorna None | OK |
| TTS Piper disponible | `True` |
| grep Gemini en código funcional | 0 resultados |
| grep `src.engines.ai` en código | 0 resultados |

## 8. Cómo Ejecutar

```bash
# Activar entorno
source venv/bin/activate

# Generar guía de audio para una HU
python main.py audio-guide --hu HU-6682 --project cecoban

# Generar documento de evidencia
python main.py evidence-v2 --project cecoban --hu HU-6682

# Parsear Excel a JSON
python main.py parse-excel --project cecoban --sprint sprint-02

# Listar guías existentes
python main.py audio-guide --list

# Lanzar app Electron (requiere dependencias de sistema)
python main.py recorder
```
