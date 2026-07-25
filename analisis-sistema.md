# Análisis Completo del Sistema "automatic-test-case"

---

## 1. PROPÓSITO DEL SISTEMA

Sistema de **generación automatizada de evidencias de prueba** para equipos de QA. Toma grabaciones de pantalla (vídeos MP4) de ejecuciones manuales de pruebas, extrae frames, los correlaciona con casos de prueba definidos en Excel, y genera documentos Word (.docx) con las imágenes como evidencia.

---

## 2. ARQUITECTURA GENERAL

```
                    ┌─────────────────────────────────────────────┐
                    │              CONFIGURACIÓN                   │
                    │  config/settings.json  +  trazabilidad.json  │
                    └──────────┬──────────────────────┬───────────┘
                               │                      │
        ┌──────────────────────▼──────────┐  ┌────────▼──────────┐
        │       main.py (ENTRY POINT)     │  │  scripts/         │
        │  Orquestador principal modular  │  │  Pipeline alterno  │
        └───────┬───────────┬─────────────┘  │  (análisis video   │
                │           │                 │   + generación)    │
        ┌───────▼────┐ ┌───▼────────┐        └────────────────────┘
        │  core/     │ │ Entregas:  │
        │  Módulos   │ │ .docx      │
        │  reutiliz. │ │ finales    │
        └────────────┘ └────────────┘
```

---

## 3. FLUJO DE DATOS COMPLETO

### Pipeline Principal (`main.py` + `core/`)

```
 1. settings.json ──► Lista de HUs (HU-6680, HU-6682, ...)
 2. trazabilidad.json ──► Rangos de frames [inicio, fin] por CP
 3. Por cada HU:
    a. Leer Excel (hoja "Diseño" o "Ejecución", header row 6)
       → Lista de CPs con ID, nombre, resultado esperado
    b. Buscar template Word (.docx) en la carpeta de la HU
    c. Abrir el documento con python-docx
    d. Identificar tablas 1x1 (celdas contenedoras de imagen)
    e. Para cada tabla, mapear con un CP por índice de orden
    f. Para cada CP, buscar la mejor imagen según trazabilidad.json
       (considerando image_map.json de duplicados descartados)
    g. Insertar imagen (centrada, 5.5 pulgadas) en la celda
    h. Guardar: deliverables/Evidencia_HU-XXXX.docx
              + carpeta HU/Evidencia_HU-XXXX_Final.docx
```

### Pipeline de Análisis de Video (`scripts/analizar_videos.py`)

```
 1. Leer Excel de HU (mismos CPs)
 2. Por cada video MP4 encontrado:
    a. Extraer frames a 1 FPS con ffmpeg → tmp_frames/
    b. Transcribir audio con Whisper (modelo "base") → texto + segmentos
    c. Para cada frame único (hash perceptual):
       - Preprocesar (escala de grises + Otsu binarization)
       - OCR con pytesseract (español)
    d. Matching dual por CP:
       - Visual: fuzzy match (token_set_ratio) del nombre del CP contra OCR
       - Audio: fuzzy match contra transcripción de Whisper
       - Mejor segundo (mayor score, umbral >= 55)
    e. Anotar frame principal:
       - Detectar texto relevante en la imagen
       - Flood fill clustering de palabras
       - Dibujar rectángulo verde + flecha indicadora
    f. Copiar frames de contexto (2s antes/después)
    g. Actualizar archivo .md en Test_Suite/CP_XXX/CP_XXX.md
       con timestamp e imágenes
 3. Limpiar directorios temporales
```

### Pipeline con IA Gemini (`scripts/analizar_videos_ai.py`)

```
 1. Subir video a servidores de Google Gemini
 2. Enviar prompt con lista de CPs (ID, nombre, resultado esperado)
 3. Gemini responde JSON con:
    - segundo_exacto por CP
    - bounding_box [ymin, xmin, ymax, xmax] normalizado 0-1000
 4. Extraer frame quirúrgico con ffmpeg en ese segundo exacto
 5. Dibujar bounding box (verde semitransparente + flecha)
 6. Actualizar .md en Test_Suite/
 7. Eliminar video de servidores Gemini
```

---

## 4. ESTRUCTURA DE DIRECTORIOS (con propósito)

```
automatic-test-case/
├── main.py                          ← Orquestador principal (entry point)
├── analisis-sistema.md              ← Este archivo
├── .env                             ← API key de Gemini
├── check_cp.py                      ← Test: parseo de Excel
├── check_whisper.py                 ← Test: transcripción Whisper
├── check_word.py                    ← Test: verificación de docx
├── test_parse.py                    ← Test: parseo de .md
├── test_parse2.py                   ← Test: parseo de .md (v2)
├── test_docx.py                     ← Test: estructura de Word
├── test_docx2.py                    ← Test: contenido de tablas
├── test_docx3.py                    ← Test: mapeo tabla-CP
├── create_video_folders.py          ← Utilidad: crear carpetas de videos
├── rename_project.py                ← Utilidad: renombrar a inglés
├── update_mds.py                    ← Utilidad: actualizar .md con resultado esperado
├── generacion_evidencias.log        ← Log de ejecución de main.py
│
├── config/
│   ├── settings.json                ← Mapeo HU → ruta de carpeta
│   └── trazabilidad.json            ← Rangos de frames [inicio, fin] por CP
│
├── core/
│   ├── excel_parser.py              ← Lectura de Excel de CPs
│   ├── image_processor.py           ← Selección de mejor imagen por rango
│   ├── docx_generator.py            ← Inserción de imágenes en Word
│   └── audio_processor.py           ← Transcripción Whisper (cargado lazy)
│
├── scripts/
│   ├── create_suite_folders.py      ← Crea Test_Suite/CP_XXX/CP_XXX.md
│   ├── analizar_videos.py           ← Pipeline OCR dual (pytesseract + Whisper)
│   ├── analizar_videos_ai.py        ← Pipeline con IA Gemini
│   ├── generate_evidences.py        ← V1: inserción por marcadores "N. EVIDENCIA"
│   ├── generate_evidences_v2.py     ← V2: inserción en tablas 1x1 (standalone)
│   ├── analyze_discard_duplicates.py← Deduplicación de frames (MD5 + MSE)
│   ├── exportar_a_word.py           ← Exporta .md a Word
│   ├── generate_tools_option2.py    ← Genera catálogo HTML + Excel maestro
│   ├── recover_excel.py             ← Recupera test01.xlsx dañado
│   └── extract_ocr_text.py          ← OCR batch con multiprocesamiento
│
├── deliverables/                    ← Documentos Word generados (6 entregables)
│   ├── Evidencia_HU-6680.docx
│   ├── Evidencia_HU-6680_BoxTest.docx
│   ├── Evidencia_HU-6682.docx
│   ├── Evidencia_HU-6686.docx
│   ├── Evidencia_HU-6687.docx
│   ├── Evidencia_HU-6688.docx
│   └── Evidencia_HU-6689.docx
│
├── mapping_data/                    ← Datos de mapeo intermedios
│   ├── image_map.json               ← Mapa frame duplicado → frame canónico
│   ├── duplicates_report.json       ← Informe de deduplicación
│   ├── master_evidence_mapping.xlsx ← Excel maestro de mapeo
│   ├── test01.xlsx                  ← Datos de prueba (HU-6687, 6688, 6689)
│   ├── test02.xlsx                  ← Datos de prueba adicionales
│   └── times.xlsx                   ← Mapeo tiempos → rangos de imágenes
│
├── user_stories/
│   ├── sprint-01/                   ← Vacío
│   ├── sprint-02/                   ← 14 HU con CPs
│   │   ├── CP_HU-6680 Consultar Plantillas de Eventos/
│   │   ├── CP_HU-6682 Crear Plantilla de Evento/
│   │   ├── CP_HU-6686 Editar Plantilla de Evento/
│   │   ├── CP_HU-6687 Consultar Diagrama de Flujo/
│   │   ├── CP_HU-6688 Descargar Diagrama de Flujo PNG/
│   │   ├── CP_HU-6689 Descargar Diagrama de Flujo PDF/
│   │   ├── CP_HU-6699 Crear Activo Expirable/
│   │   ├── CP_HU-6702 Editar Activo Expirable/
│   │   ├── CP_HU-6704 Consultar Flujo de Renovación/
│   │   ├── CP_HU-7036 Consultar perfiles/
│   │   ├── CP_HU-7037 Buscar y Filtrar Perfiles/
│   │   ├── CP_HU-7038 Crear perfil/
│   │   ├── CP_HU-7039 Editar perfil/
│   │   └── CP_HU-7042 Inhabilitar perfil/
│   ├── sprint-03/                   ← Vacío
│   ├── sprint-04/                   ← Vacío
│   └── sprint-05/                   ← Vacío
│
├── video/                           ← 445 frames únicos + 58 descartados
│   ├── scene00001.png ... scene07531.png
│   └── descartadas/                 ← 58 frames duplicados/estáticos
│
├── tools/
│   └── catalog.html                 ← Catálogo visual de 445 imágenes
│
└── venv/                            ← Virtual environment Python 3.12
```

---

## 5. TECH STACK

| Tecnología | Uso |
|---|---|
| **Python 3.12** | Lenguaje principal |
| **python-docx** | Manipulación de documentos Word |
| **pandas / openpyxl / xlsxwriter** | Procesamiento de Excel |
| **opencv-python-headless** | Procesamiento de imágenes, anotaciones |
| **Pillow (PIL)** | Apertura de imágenes, hashing perceptual |
| **pytesseract** | OCR (reconocimiento de texto en imágenes) |
| **imagehash** | Hash perceptual para detección de duplicados |
| **thefuzz** | Fuzzy string matching (token_set_ratio) |
| **openai-whisper** | Transcripción de audio de videos |
| **google-genai** | API de Gemini para análisis de video con IA |
| **ffmpeg** | Extracción de frames, captura de frames precisos |
| **numpy** | Operaciones numéricas (MSE, arrays de imagen) |
| **python-dotenv** | Carga de API key de Gemini |

---

## 6. MODELO DE DATOS

### Entidades principales

| Entidad | Descripción | Atributos clave |
|---|---|---|
| **HU** (Historia de Usuario) | User story del producto | ID (HU-6680), nombre, carpeta |
| **CP** (Caso de Prueba) | Test case individual | ID (CP_001), nombre, resultado esperado, pasos |
| **Frame** (escena) | Captura de pantalla del video | scene00001.png (índice numérico) |
| **Evidencia** | Documento Word generado | Evidencia_HU-XXXX.docx |

### Relaciones

- **HU** 1→N **CP** (definido en Excel)
- **HU** 1→1 **Evidencia.docx**
- **CP** 1→N **Frames** (definido por rango en trazabilidad.json)
- **CP** 1→1 **Carpeta en Test_Suite/** con archivo .md

### Archivos de configuración clave

**config/settings.json**
```json
{
    "base_dir": ".",
    "video_dir": "video",
    "map_file": "mapa_imagenes.json",
    "hu_folders": {
        "HU-6680": "user_stories/sprint-02/CP_HU-6680 Consultar Plantillas de Eventos",
        ...
    }
}
```

**config/trazabilidad.json**
```json
{
    "HU-6686": {
        "CP_001": [130, 134],
        "CP_002": [134, 148],
        ...
    }
}
```

---

## 7. HALLAZGOS IMPORTANTES

### 7.1 Problema de rutas (settings.json vs. directorios reales)

`config/settings.json` usa rutas relativas con `sprint-02/` y nombres en español. Sin embargo, `rename_project.py` renombró directorios a inglés pero la configuración **no se actualizó completamente**. El log muestra:

- **Primera ejecución**: rutas sin `sprint-02/` con nombres en inglés → funciona
- **Segunda ejecución**: rutas con `sprint-02/` incluido → también funciona

Las carpetas existen en ambas ubicaciones pero la inconsistencia es frágil.

### 7.2 Trazabilidad incompleta

`config/trazabilidad.json` solo cubre **6 HUs** (6680-6689). Las HUs adicionales (6699, 6702, 6704, 7036-7042) **no tienen trazabilidad definida**, por lo que `main.py` no puede generar evidencias para ellas. El sistema usa un fallback `(1, 10)` que es incorrecto.

### 7.3 Selección de imágenes subóptima

`select_best_image_for_cp()` en `core/image_processor.py` siempre retorna solo `candidate_files[0]` (la primera imagen del rango), ignorando las demás candidatas. Esto frecuentemente selecciona un frame de transición en lugar del momento clave del CP.

### 7.4 Duplicación de lógica

- `core/image_processor.py` y `scripts/generate_evidences_v2.py` tienen **código duplicado** (select_best_image_for_cp, get_available_images, load_image_map)
- `core/excel_parser.py` y `scripts/generate_evidences_v2.py` tienen **lectura de Excel duplicada**
- `core/docx_generator.py` y `scripts/generate_evidences_v2.py` tienen **inserción de imágenes duplicada**

### 7.5 Sin pruebas automatizadas

No hay tests unitarios ni de integración. Los archivos `test_*.py` son scripts de verificación manual sin un framework de testing.

### 7.6 API key expuesta

La clave `GEMINI_API_KEY` está en `.env` pero el proyecto **no tiene `.gitignore`**, lo que representa un riesgo de seguridad si se inicializa un repositorio git.

### 7.7 Videos originales no presentes

No hay archivos MP4 en el repositorio. Los scripts `analizar_videos.py` y `analizar_videos_ai.py` no pueden ejecutarse sin los videos fuente. Solo están los frames ya extraídos.

### 7.8 Sprints vacíos

Los sprints 01, 03, 04 y 05 están vacíos. Solo sprint-02 contiene datos.

---

## 8. RECOMENDACIONES

1. **Unificar configuración** usando siempre las mismas rutas (con o sin `sprint-02/`), consistentemente entre `settings.json` y los scripts.
2. **Centralizar lógica duplicada** en `core/` y que tanto `main.py` como los scripts en `scripts/` la consuman, eliminando código repetido.
3. **Mejorar selección de imágenes** usando mid-point del rango, clustering temporal, o selección basada en el resultado esperado del CP (no solo la primera imagen).
4. **Agregar trazabilidad** completa para las HUs 6699, 6702, 6704, 7036, 7037, 7038, 7039 y 7042.
5. **Implementar tests** con pytest para al menos los módulos `core/`.
6. **Proteger API key** agregando `.env` a un `.gitignore` si se inicializa git.
7. **Agregar este análisis** como documento de referencia (ya hecho).
8. **Evaluar el pipeline de IA Gemini** vs el pipeline OCR local para determinar cuál es más preciso y conviene mantener.
9. **Documentar el flujo de trabajo completo** en un README.md con instrucciones de instalación, configuración y uso.

---

## 9. MAPA DE ARCHIVOS POR FUNCIÓN

### Generación de evidencias (principal)
| Archivo | Líneas | Rol |
|---|---|---|
| `main.py` | 115 | Orquestador modular |
| `core/excel_parser.py` | 31 | Lectura de Excel |
| `core/image_processor.py` | 82 | Selección de imágenes |
| `core/docx_generator.py` | 39 | Inserción en Word |

### Análisis de video (matching automático)
| Archivo | Líneas | Rol |
|---|---|---|
| `scripts/analizar_videos.py` | 474 | Pipeline OCR dual |
| `scripts/analizar_videos_ai.py` | 295 | Pipeline IA Gemini |
| `core/audio_processor.py` | 42 | Transcripción Whisper |

### Utilidades y herramientas
| Archivo | Líneas | Rol |
|---|---|---|
| `scripts/create_suite_folders.py` | 141 | Crear estructura Test_Suite |
| `scripts/generate_evidences.py` | 316 | V1 generación de evidencias |
| `scripts/generate_evidences_v2.py` | 256 | V2 generación (standalone) |
| `scripts/analyze_discard_duplicates.py` | 168 | Deduplicación de frames |
| `scripts/exportar_a_word.py` | 157 | Exportar .md → Word |
| `scripts/generate_tools_option2.py` | 115 | Catálogo HTML + Excel maestro |
| `scripts/recover_excel.py` | 46 | Recuperar Excel dañado |
| `scripts/extract_ocr_text.py` | 47 | OCR batch multiproceso |
