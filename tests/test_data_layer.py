#!/usr/bin/env python3
"""Smoke test para validar la capa de datos y el generador de audio-guía."""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from src.data.story_scanner import scan_sprints, scan_hu_folders
from src.data.excel_reader import read_hu_excel_with_details, read_positive_test_cases

# 1. Test story scanner
print("=== Story Scanner ===")
sprints = scan_sprints(BASE_DIR)
print(f"Sprints: {sprints}")

for sprint in sprints:
    folders = scan_hu_folders(BASE_DIR, sprint)
    for f in folders:
        print(f"  {f.hu_id} | excel={f.has_excel} | word={f.has_word} | {f.folder_name}")

# 2. Test excel reader con la primera HU que tenga Excel
folders = scan_hu_folders(BASE_DIR, "sprint-02")
for hu in folders[:2]:
    if hu.has_excel:
        print(f"\n=== Excel Reader: {hu.hu_id} ===")
        all_cps = read_hu_excel_with_details(hu.path)
        pos_cps = read_positive_test_cases(hu.path)
        print(f"Total CPs: {len(all_cps)}, Positivos: {len(pos_cps)}")
        for tc in all_cps[:5]:
            status = "POSITIVO" if tc.is_positive else "NEGATIVO"
            print(f"  [{status}] {tc.id} | {tc.nombre[:70]}")
            if tc.pasos:
                print(f"         Pasos: {tc.pasos[:80]}...")
            if tc.resultado_esperado:
                print(f"         Resultado: {tc.resultado_esperado[:80]}...")
        break

print("\n=== Smoke Test PASSED ===")
