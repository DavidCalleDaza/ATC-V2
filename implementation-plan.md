# Plan de Implementación - automatic-test-case

## 1. Bug del desfase (causa raíz)

### 1.1 Python — `_extract_segments` en `src/generators/audio_guide.py`

**Problema**: `block.split('\\n')` — En Python, `'\\n'` son dos caracteres (backslash + n literal), no un salto de línea real. El método `split('\n')` (con `\n` real) o `splitlines()` es lo correcto.

**Consecuencia**: El bloque introductorio completo se trata como una sola línea. Como empieza con `# Guía de Ejecución...`, la línea completa se filtra por `line.startswith('#')`, eliminando el segmento de introducción. Esto produce un desfase de 1 paso: JS asigna `durations[0]` al texto de "Introducción", pero la duración real corresponde al audio del Paso 1.

**Fix**: Cambiar `block.split('\\n')` → `block.splitlines()`

**Estado**: ✅ COMPLETADO

### 1.2 JavaScript — Título de segmentos en `recorder/renderer/renderer.js`

**Problema**: `blocks[i].split('\\n')[0]` — Mismo error: en JS, `'\\n'` es literal "\n", no newline. `'\n'` es el newline correcto.

**Consecuencia**: El primer elemento del split retorna el bloque completo (sin dividir), y el título del segmento incluye todo el contenido del bloque.

**Fix**: Cambiar `blocks[i].split('\\n')[0]` → `blocks[i].split('\n')[0]`

**Estado**: ✅ COMPLETADO

## 2. Control de velocidad de reproducción

### 2.1 State — `recorder/renderer/renderer.js`

Agregar `playbackSpeed: 1.0` al objeto `state`.

**Estado**: ✅ COMPLETADO

### 2.2 UI — `recorder/renderer/index.html`

Agregar slider de velocidad en la sección `#phase-recording` (entre el botón de pausa y el botón de finalizar).

**Estado**: ✅ COMPLETADO

### 2.3 Lógica — `recorder/renderer/renderer.js`

- En `playFrom()`: aplicar `currentAudioNode.playbackRate.value = state.playbackSpeed`
- Agregar event listener `input` en el slider de velocidad
- Mostrar label con valor actual (ej: "1.0×")

**Estado**: ✅ COMPLETADO

### 2.4 Estilos — `recorder/renderer/styles.css`

Agregar estilos para `.speed-control`, `.speed-slider`, `.speed-label`.

**Estado**: ✅ COMPLETADO

## 3. Voz femenina español latino (es_MX)

### 3.1 Script de descarga — `recorder/setup.sh`

Agregar descarga de `es_MX-claude-high.onnx` y su config `.onnx.json` desde HuggingFace.

**Estado**: ⬜ PENDIENTE

## 4. Salvaguarda de segmentos

### 4.1 Python — `src/generators/audio_guide.py`

Agregar guarda en `_md_to_narration_segments` o `_extract_segments`: si el segmento de introducción está vacío después del filtrado, insertar un segmento dummy para mantener la alineación con el array de duraciones.

**Estado**: ⬜ PENDIENTE

## 5. Verificación

- Ejecutar `python3 tests/test_audio_guide_smoke.py` para verificar que la generación de guión y segmentos funciona
- Verificar que `_extract_segments` retorna el número correcto de segmentos (intro + N pasos)
- Verificar que los títulos en JS son correctos (solo primera línea)