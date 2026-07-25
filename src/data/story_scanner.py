"""
story_scanner.py — Escaneo dinámico de la estructura user_stories/.

Recorre automáticamente los sprints y carpetas CP_HU-XXXX para
descubrir historias de usuario disponibles sin hardcodear rutas.
"""

import re
import logging
from pathlib import Path
from dataclasses import dataclass
from typing import List, Optional

logger = logging.getLogger(__name__)


@dataclass
class HuFolder:
    """Metadata de una carpeta de Historia de Usuario."""
    hu_id: str           # ej: "HU-6682"
    folder_name: str     # ej: "CP_HU-6682 Crear Plantilla de Evento"
    path: Path           # ruta absoluta a la carpeta
    sprint: str          # ej: "sprint-02"
    has_excel: bool      # si tiene un archivo .xlsx válido
    has_word: bool       # si tiene un archivo .docx válido


def _extract_hu_id(folder_name: str) -> Optional[str]:
    """Extrae el ID de HU del nombre de carpeta (ej: CP_HU-6682 → HU-6682)."""
    match = re.search(r'HU-\d+', folder_name)
    return match.group(0) if match else None


def _has_valid_excel(folder_path: Path) -> bool:
    """Verifica si la carpeta tiene al menos un Excel válido."""
    xlsx_files = [
        f for f in folder_path.glob("*.xlsx")
        if not f.name.startswith("~$") and not f.name.startswith(".")
    ]
    return len(xlsx_files) > 0


def _has_valid_word(folder_path: Path) -> bool:
    """Verifica si la carpeta tiene al menos un Word válido."""
    docx_files = [
        f for f in folder_path.glob("*.docx")
        if not f.name.startswith("~$")
        and not f.name.startswith(".")
        and not f.name.endswith("_Final.docx")
        and not f.name.startswith("Evidencia_")
    ]
    return len(docx_files) > 0


# ── API Pública ────────────────────────────────────────────────────────────────

def get_projects_dir(base_dir: Path) -> Path:
    """Retorna la ruta al directorio raíz projects/."""
    return base_dir / "projects"


def scan_projects(base_dir: Path) -> List[str]:
    """Lista todos los proyectos disponibles."""
    projects_dir = get_projects_dir(base_dir)
    if not projects_dir.exists():
        return []
    projects = [d.name for d in projects_dir.iterdir() if d.is_dir() and not d.name.startswith(".")]
    return sorted(projects)


def scan_sprints(base_dir: Path, project_name: str = None) -> List[str]:
    """
    Lista todos los sprints disponibles dentro de un proyecto.
    Si project_name no se provee, buscará en el proyecto por defecto 'Legacy'.
    """
    project_name = project_name or "Legacy"
    project_dir = get_projects_dir(base_dir) / project_name
    
    if not project_dir.exists():
        logger.warning(f"No existe el directorio de proyecto {project_dir}")
        return []

    sprints = [
        d.name for d in project_dir.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    ]
    logger.info(f"Sprints encontrados en {project_name}: {sprints}")
    return sorted(sprints)


def scan_hu_folders(base_dir: Path, sprint: str, project_name: str = None) -> List[HuFolder]:
    """
    Lista todas las carpetas HU dentro de un sprint específico.
    Retorna lista de HuFolder ordenada por HU ID.
    """
    project_name = project_name or "Legacy"
    sprint_dir = get_projects_dir(base_dir) / project_name / sprint
    if not sprint_dir.exists():
        logger.warning(f"No existe el directorio del sprint: {sprint_dir}")
        return []

    folders = []
    for d in sorted(sprint_dir.iterdir()):
        if not d.is_dir():
            continue
        if not (d.name.startswith("CP_") or d.name.startswith("HU")):
            continue

        hu_id = _extract_hu_id(d.name)
        if not hu_id:
            logger.warning(f"No se pudo extraer HU ID de: {d.name}")
            continue

        folders.append(HuFolder(
            hu_id=hu_id,
            folder_name=d.name,
            path=d,
            sprint=sprint,
            has_excel=_has_valid_excel(d),
            has_word=_has_valid_word(d),
        ))

    folders.sort(key=lambda f: f.hu_id)
    logger.info(f"Sprint {sprint}: {len(folders)} HUs encontradas")
    return folders


def scan_all_hu_folders(base_dir: Path, project_name: str = None) -> List[HuFolder]:
    """
    Escanea TODOS los sprints de un proyecto y retorna una lista completa de HU folders.
    """
    all_folders = []
    for sprint in scan_sprints(base_dir, project_name):
        all_folders.extend(scan_hu_folders(base_dir, sprint, project_name))
    return all_folders


def find_hu_folder(base_dir: Path, hu_id: str, project_name: str = None) -> Optional[HuFolder]:
    """
    Busca una HU específica por ID en todos los sprints de un proyecto.
    Retorna la primera coincidencia o None.
    """
    for folder in scan_all_hu_folders(base_dir, project_name):
        if folder.hu_id == hu_id:
            return folder
    logger.warning(f"No se encontró carpeta para {hu_id}")
    return None
