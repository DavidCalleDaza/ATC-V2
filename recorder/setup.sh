#!/usr/bin/env bash
set -euo pipefail

echo "=== Antigravity — Setup ==="
echo ""

# --- Check Node.js ---
if ! command -v node &>/dev/null; then
  echo "[ERROR] Node.js no está instalado. Instálalo desde https://nodejs.org (v18+)"
  exit 1
fi
echo "[OK] Node.js $(node --version)"

# --- Check npm ---
if ! command -v npm &>/dev/null; then
  echo "[ERROR] npm no está instalado."
  exit 1
fi
echo "[OK] npm $(npm --version)"

# --- Check ffmpeg ---
if ! command -v ffmpeg &>/dev/null; then
  echo "[WARNING] ffmpeg no encontrado. Necesario para conversión a MP4."
  echo "  Instálalo con: sudo apt install ffmpeg"
else
  echo "[OK] ffmpeg $(ffmpeg -version 2>&1 | head -1)"
fi

# --- Check/install Piper TTS ---
if ! command -v piper &>/dev/null; then
  echo ""
  echo "Instalando Piper TTS..."
  pip3 install piper-tts 2>&1 | tail -1
fi

if command -v piper &>/dev/null; then
  echo "[OK] Piper TTS $(piper --help 2>&1 | head -1)"
else
  echo "[WARNING] Piper TTS no se pudo instalar automáticamente."
  echo "  Instálalo manualmente con: pip3 install piper-tts"
fi

# --- Check Spanish voice model ---
MODEL_DIR="$(dirname "$0")/tts-models"
if ls "$MODEL_DIR"/*.onnx 1>/dev/null 2>&1; then
  echo "[OK] Modelo de voz español encontrado en tts-models/"
else
  echo ""
  echo "Descargando modelo de voz español (es_ES-sharvard-medium)..."
  MODEL="es_ES-sharvard-medium"
  BASE_URL="https://huggingface.co/rhasspy/piper-voices/resolve/main/es/es_ES/sharvard/medium"
  curl -L -o "$MODEL_DIR/$MODEL.onnx" "$BASE_URL/$MODEL.onnx"
  curl -L -o "$MODEL_DIR/$MODEL.onnx.json" "$BASE_URL/$MODEL.onnx.json"
  echo "[OK] Modelo de voz descargado"
fi

# --- Install npm dependencies ---
echo ""
echo "Instalando dependencias de Node.js..."
cd "$(dirname "$0")"
npm install 2>&1 | tail -2
echo "[OK] Dependencias instaladas"

# --- Verification ---
echo ""
echo "=== Verificación ==="
cd "$(dirname "$0")"
node -e "
const XLSX = require('xlsx');
console.log('[OK] xlsx library loaded');
" && \
node -e "
const fs = require('fs');
const path = require('path');
const modelDir = path.join(process.cwd(), 'tts-models');
const models = fs.readdirSync(modelDir).filter(f => f.endsWith('.onnx'));
console.log('[OK] ' + models.length + ' modelo(s) TTS encontrado(s): ' + models.join(', '));
"

echo ""
echo "=== Setup completado ==="
echo ""
echo "Para iniciar Antigravity:"
echo "  cd recorder && npm start"
echo ""
echo "Atajos de teclado durante la grabación:"
echo "  Enter  → Siguiente CP"
echo "  R      → Repetir narración"
