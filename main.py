#!/usr/bin/env python3
"""
main.py — CLI unificado del proyecto automatic-test-case.

Subcomandos:
  audio-guide   Genera audio-guía narrada para ejecución de pruebas
  evidence-v2   Genera evidencia analizando Insumos con matching inteligente
  recorder      Lanza la aplicación de grabación de pantalla (Electron)
  parse-excel   Lee Excels de HUs y retorna JSON con casos de prueba

Ejemplos:
  python main.py audio-guide --hu HU-6682
  python main.py audio-guide --sprint sprint-02
  python main.py audio-guide --all
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


# ── Subcomando: evidence-v2 (matching inteligente desde Insumos) ───────────────

def cmd_evidence_v2(args):
    """Genera documentos Word de evidencia analizando Insumos/ con matching inteligente."""
    from src.generators.evidence_generator import EvidenceGenerator
    from src.data.story_scanner import scan_hu_folders, scan_all_hu_folders, find_hu_folder

    generator = EvidenceGenerator(BASE_DIR)
    project = args.project
    results = []

    if args.hu:
        hu_folder = find_hu_folder(BASE_DIR, args.hu, project_name=project)
        if not hu_folder:
            print(f"✗ No se encontró carpeta para {args.hu}")
            sys.exit(1)
        result = generator.process_hu(hu_folder.path)
        if result:
            results.append(result)
            print(f"\n✓ Evidencia generada: {result}")

    elif args.sprint:
        folders = scan_hu_folders(BASE_DIR, args.sprint, project_name=project)
        for hu in folders:
            if hu.has_excel:
                result = generator.process_hu(hu.path)
                if result:
                    results.append(result)
        print(f"\n✓ {len(results)} evidencias generadas para {args.sprint}")

    elif args.all:
        folders = scan_all_hu_folders(BASE_DIR, project_name=project)
        for hu in folders:
            if hu.has_excel:
                result = generator.process_hu(hu.path)
                if result:
                    results.append(result)
        print(f"\n✓ {len(results)} evidencias generadas en total")

    else:
        print("Especifica --hu, --sprint o --all. Usa --help para más info.")
        sys.exit(1)

    if not results:
        print("✗ No se generaron documentos de evidencia")


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


# ── Subcomando: parse-excel ────────────────────────────────────────────────────

def cmd_parse_excel(args):
    """Lee los Excels de todas las HUs de un sprint y retorna JSON con los CPs."""
    import json
    import sys
    from io import StringIO
    from src.data.excel_reader import read_hu_excel_with_details
    from src.data.story_scanner import scan_hu_folders, find_hu_folder

    # Redirigir logging a stderr para que stdout solo tenga el JSON
    root_logger = logging.getLogger()
    original_handlers = root_logger.handlers[:]
    root_logger.handlers = [logging.StreamHandler(sys.stderr)]

    try:
        project = args.project
        result = {}

        if args.hu:
            hu_folder = find_hu_folder(BASE_DIR, args.hu, project_name=project)
            if not hu_folder:
                print(json.dumps({}))
                return
            folders = [hu_folder]
        elif args.sprint:
            folders = scan_hu_folders(BASE_DIR, args.sprint, project_name=project)
        else:
            print(json.dumps({}))
            return

        for hu in folders:
            if not hu.has_excel:
                continue
            try:
                test_cases = read_hu_excel_with_details(hu.path)
                result[hu.hu_id] = [
                    {
                        "id": tc.id,
                        "nombre": tc.nombre,
                        "resumen": tc.resumen,
                        "precondiciones": tc.precondiciones,
                        "pasos": tc.pasos,
                        "resultado_esperado": tc.resultado_esperado,
                        "contexto": tc.contexto,
                        "hu_id": tc.hu_id,
                        "hu_nombre": tc.hu_nombre,
                        "is_positive": tc.is_positive,
                    }
                    for tc in test_cases
                ]
            except Exception as e:
                logging.warning(f"Error leyendo Excel de {hu.hu_id}: {e}")

        print(json.dumps(result, ensure_ascii=False))
    finally:
        root_logger.handlers = original_handlers


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

    # evidence-v2
    ev2 = subparsers.add_parser(
        "evidence-v2",
        help="Genera evidencia analizando Insumos con matching inteligente"
    )
    ev2_group = ev2.add_mutually_exclusive_group()
    ev2_group.add_argument("--hu", type=str, help="ID de HU específica (ej: HU-6682)")
    ev2_group.add_argument("--sprint", type=str, help="Sprint a procesar (ej: sprint-02)")
    ev2_group.add_argument("--all", action="store_true", help="Procesar todos los sprints")
    ev2.add_argument("--project", type=str, required=True, help="Nombre del proyecto")

    # recorder
    subparsers.add_parser(
        "recorder",
        help="Lanza la aplicación de grabación de pantalla (Electron)"
    )

    # parse-excel
    pe = subparsers.add_parser(
        "parse-excel",
        help="Lee Excels de HUs y retorna JSON con casos de prueba"
    )
    pe.add_argument("--project", type=str, required=True, help="Nombre del proyecto")
    pe_group = pe.add_mutually_exclusive_group()
    pe_group.add_argument("--sprint", type=str, help="Sprint a procesar (ej: sprint-02)")
    pe_group.add_argument("--hu", type=str, help="ID de HU específica")

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    commands = {
        "audio-guide": cmd_audio_guide,
        "evidence-v2": cmd_evidence_v2,
        "recorder": cmd_recorder,
        "parse-excel": cmd_parse_excel,
    }

    cmd_func = commands.get(args.command)
    if cmd_func:
        cmd_func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
