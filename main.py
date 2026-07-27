#!/usr/bin/env python3
"""
main.py — CLI unificado del proyecto automatic-test-case.

Subcomandos:
  audio-guide   Genera audio-guía narrada para ejecución de pruebas
  evidence      Genera documentos Word de evidencia (pipeline original)
  create-suite  Crea estructura Test_Suite/ con carpetas y .md por CP
  recorder      Lanza la aplicación de grabación de pantalla (Electron)

Ejemplos:
  python main.py audio-guide --hu HU-6682
  python main.py audio-guide --sprint sprint-02
  python main.py audio-guide --all
  python main.py evidence --all
  python main.py create-suite --sprint sprint-02
"""

import sys
import argparse
import logging
from pathlib import Path

BASE_DIR = Path(__file__).parent

# Asegurar que src/ está en el path
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(BASE_DIR / "generacion_evidencias.log", encoding='utf-8'),
        logging.StreamHandler()
    ]
)


# ── Subcomando: audio-guide ────────────────────────────────────────────────────

def cmd_audio_guide(args):
    """Genera audio-guía narrada desde los CPs positivos del Excel."""
    from src.generators.audio_guide import AudioGuideGenerator

    generator = AudioGuideGenerator(BASE_DIR)

    if args.hu:
        result = generator.generate_for_hu(args.hu, project_name=args.project, force=args.force)
        if result:
            print(f"\n✓ Audio-guía generado: {result}")
        else:
            print(f"\n✗ No se pudo generar audio-guía para {args.hu}")
            sys.exit(1)

    elif args.sprint:
        results = generator.generate_for_sprint(args.sprint, force=args.force)
        print(f"\n✓ {len(results)} audio-guías generadas para {args.sprint}")

    elif args.all:
        results = generator.generate_all(force=args.force)
        print(f"\n✓ {len(results)} audio-guías generadas en total")

    elif args.list:
        guides = generator.list_existing_guides()
        if not guides:
            print("No hay guías de audio generadas.")
            return
        print(f"\n{'HU ID':<15} {'Sprint':<15} {'Tamaño':<10} {'Ruta'}")
        print("-" * 70)
        for g in guides:
            print(f"{g['hu_id']:<15} {g['sprint']:<15} {g['wav_size_kb']:>6} KB  {g['wav_path']}")

    else:
        print("Especifica --hu, --sprint, --all o --list. Usa --help para más info.")


# ── Subcomando: evidence (pipeline original) ───────────────────────────────────

def cmd_evidence(args):
    """Genera documentos Word de evidencia (pipeline original de main.py)."""
    import json
    from docx import Document
    from core.excel_parser import read_hu_excel
    from core.image_processor import load_image_map, get_available_images, select_best_image_for_cp
    from core.docx_generator import find_hu_docx, insert_image_into_box_table

    # Cargar configuración
    config_dir = BASE_DIR / "config"
    with open(config_dir / "settings.json", 'r', encoding='utf-8') as f:
        settings = json.load(f)
    with open(config_dir / "trazabilidad.json", 'r', encoding='utf-8') as f:
        trazabilidad = json.load(f)

    video_dir = BASE_DIR / settings.get("video_dir", "video")
    map_file = BASE_DIR / settings.get("map_file", "mapa_imagenes.json")
    image_map = load_image_map(map_file)
    available_images = get_available_images(video_dir)

    hu_folders = settings.get("hu_folders", {})

    if args.hu:
        if args.hu not in hu_folders:
            print(f"✗ {args.hu} no encontrada en settings.json")
            sys.exit(1)
        hu_folders = {args.hu: hu_folders[args.hu]}

    for hu_id, folder_name in hu_folders.items():
        folder_path = BASE_DIR / folder_name
        logging.info(f"{'='*50}")
        logging.info(f"PROCESANDO {hu_id}: {folder_name}")

        if not folder_path.exists():
            logging.error(f"No existe la carpeta {folder_name}")
            continue

        df_excel = read_hu_excel(folder_path)
        docx_path = find_hu_docx(folder_path)

        if not docx_path:
            logging.error(f"No se encontró plantilla Word original en {folder_name}")
            continue

        doc = Document(docx_path)
        box_tables = [t for t in doc.tables if len(t.rows) == 1 and len(t.columns) == 1]

        cp_list = []
        if not df_excel.empty and 'Id Caso de prueba' in df_excel.columns:
            cp_list = [str(cp).strip() for cp in df_excel['Id Caso de prueba'].dropna()]

        for idx, b_table in enumerate(box_tables):
            cp_id = cp_list[idx] if idx < len(cp_list) else f"CP_{idx+1:03d}"
            selected_imgs = select_best_image_for_cp(hu_id, cp_id, available_images, image_map, trazabilidad)
            insert_image_into_box_table(b_table, selected_imgs, video_dir)

        deliverables_dir = BASE_DIR / "deliverables"
        deliverables_dir.mkdir(exist_ok=True)
        out_root = deliverables_dir / f"Evidencia_{hu_id}.docx"
        out_folder = folder_path / f"Evidencia_{hu_id}_Final.docx"

        try:
            doc.save(str(out_root))
            doc.save(str(out_folder))
            logging.info(f"Evidencia guardada: {out_root.relative_to(BASE_DIR)}")
        except Exception as e:
            logging.error(f"Error guardando evidencia {hu_id}: {e}")

    logging.info("=== PROCESO DE EVIDENCIAS COMPLETADO ===")


# ── Subcomando: create-suite ───────────────────────────────────────────────────

def cmd_create_suite(args):
    """Crea estructura Test_Suite/ con carpetas y .md por CP."""
    from scripts.create_suite_folders import create_suite_for_folder
    from src.data.story_scanner import scan_hu_folders, scan_all_hu_folders

    if args.sprint:
        folders = scan_hu_folders(BASE_DIR, args.sprint)
    else:
        folders = scan_all_hu_folders(BASE_DIR)

    for hu in folders:
        if hu.has_excel:
            create_suite_for_folder(hu.path)

    print(f"✓ Test Suites procesados: {len(folders)} HUs")


# ── Subcomando: recorder ──────────────────────────────────────────────────────

def cmd_recorder(args):
    """Lanza la aplicación Electron de grabación de pantalla."""
    import subprocess
    import sys
    recorder_dir = BASE_DIR / "recorder"
    if not (recorder_dir / "package.json").exists():
        print("✗ No se encontró recorder/package.json")
        sys.exit(1)

    print("Lanzando Screen Recorder...")
    subprocess.run(["npm", "start"], cwd=str(recorder_dir))


# ── Parser principal ───────────────────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="automatic-test-case",
        description="Sistema de generación automatizada de evidencias de prueba para QA"
    )
    subparsers = parser.add_subparsers(dest="command", help="Subcomando a ejecutar")

    # audio-guide
    ag = subparsers.add_parser(
        "audio-guide",
        help="Genera audio-guía narrada para ejecución de pruebas"
    )
    ag_group = ag.add_mutually_exclusive_group()
    ag_group.add_argument("--hu", type=str, help="ID de HU específica (ej: HU-6682)")
    ag_group.add_argument("--sprint", type=str, help="Sprint a procesar (ej: sprint-02)")
    ag_group.add_argument("--all", action="store_true", help="Procesar todos los sprints")
    ag_group.add_argument("--list", action="store_true", help="Listar guías existentes")
    ag.add_argument("--project", type=str, default="Legacy", help="Proyecto a procesar")
    ag.add_argument("--force", action="store_true", help="Regenerar archivos existentes")

    # evidence
    ev = subparsers.add_parser(
        "evidence",
        help="Genera documentos Word de evidencia"
    )
    ev_group = ev.add_mutually_exclusive_group()
    ev_group.add_argument("--hu", type=str, help="ID de HU específica")
    ev_group.add_argument("--all", action="store_true", default=True, help="Procesar todas las HU (default)")

    # create-suite
    cs = subparsers.add_parser(
        "create-suite",
        help="Crea estructura Test_Suite/ con carpetas y .md por CP"
    )
    cs.add_argument("--sprint", type=str, help="Sprint específico a procesar")

    # recorder
    subparsers.add_parser(
        "recorder",
        help="Lanza la aplicación de grabación de pantalla (Electron)"
    )

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    commands = {
        "audio-guide": cmd_audio_guide,
        "evidence": cmd_evidence,
        "create-suite": cmd_create_suite,
        "recorder": cmd_recorder,
    }

    cmd_func = commands.get(args.command)
    if cmd_func:
        cmd_func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
