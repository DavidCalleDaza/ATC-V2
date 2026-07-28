#!/usr/bin/env python3
"""Test del generador de guión narrativo (.md) para una HU piloto."""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from src.generators.audio_guide import AudioGuideGenerator
from src.data.story_scanner import find_hu_folder

generator = AudioGuideGenerator(BASE_DIR)

# Generar guión para HU-6680 como piloto
hu = find_hu_folder(BASE_DIR, "HU-6680")
if hu:
    print(f"=== Generando guión para {hu.hu_id}: {hu.folder_name} ===")
    md_path = generator.generate_script_md(hu)
    if md_path:
        print(f"\n✓ Guión generado en: {md_path}")
        print(f"\n{'='*60}")
        print("CONTENIDO DEL GUIÓN:")
        print(f"{'='*60}")
        with open(md_path, 'r', encoding='utf-8') as f:
            print(f.read())
    else:
        print("✗ Falló la generación del guión")
else:
    print("✗ No se encontró HU-6680")

# Verificar TTS
print(f"\n{'='*60}")
print(f"TTS disponible: {generator.tts.is_available}")
if generator.tts._model_path:
    print(f"Modelo TTS: {generator.tts._model_path.name}")
else:
    print("No se encontró modelo TTS")
