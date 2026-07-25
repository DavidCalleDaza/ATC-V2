"""
project_manager.py — Gestor de la jerarquía de proyectos y archivos.

Maneja la creación de Proyectos, Sprints y HUs en el sistema de archivos:
Estructura: projects/Proyecto_Name/sprint_name/HU_Folder/
"""

import logging
import shutil
from pathlib import Path
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

def get_projects_dir(base_dir: Path) -> Path:
    """Retorna la ruta al directorio raíz de proyectos."""
    return base_dir / "projects"

class ProjectManager:
    """Administra el ciclo de vida de los directorios de los proyectos."""
    
    def __init__(self, base_dir: Path):
        self.base_dir = Path(base_dir)
        self.projects_dir = get_projects_dir(self.base_dir)
        self.projects_dir.mkdir(parents=True, exist_ok=True)
        
    def list_projects(self) -> List[str]:
        """Devuelve una lista de los nombres de todos los proyectos creados."""
        projects = []
        if not self.projects_dir.exists():
            return projects
            
        for p in self.projects_dir.iterdir():
            if p.is_dir() and not p.name.startswith("."):
                projects.append(p.name)
        return sorted(projects)
        
    def create_project(self, project_name: str) -> bool:
        """Crea un nuevo proyecto vacío."""
        try:
            target = self.projects_dir / project_name.strip()
            target.mkdir(parents=True, exist_ok=True)
            logger.info(f"Proyecto creado: {target.name}")
            return True
        except Exception as e:
            logger.error(f"Error al crear proyecto {project_name}: {e}")
            return False

    def list_sprints(self, project_name: str) -> List[str]:
        """Devuelve los sprints de un proyecto específico."""
        project_path = self.projects_dir / project_name
        if not project_path.exists():
            return []
            
        sprints = [
            d.name for d in project_path.iterdir()
            if d.is_dir() and not d.name.startswith(".")
        ]
        return sorted(sprints)

    def create_sprint(self, project_name: str, sprint_name: str) -> bool:
        """Crea un nuevo sprint dentro de un proyecto."""
        try:
            target = self.projects_dir / project_name / sprint_name.strip()
            target.mkdir(parents=True, exist_ok=True)
            logger.info(f"Sprint creado: {project_name}/{sprint_name}")
            return True
        except Exception as e:
            logger.error(f"Error al crear sprint {sprint_name}: {e}")
            return False
            
    def list_hus(self, project_name: str, sprint_name: str) -> List[str]:
        """Devuelve las carpetas de HU dentro de un sprint."""
        sprint_path = self.projects_dir / project_name / sprint_name
        if not sprint_path.exists():
            return []
            
        hus = [
            d.name for d in sprint_path.iterdir()
            if d.is_dir() and not d.name.startswith(".")
        ]
        return sorted(hus)

    def create_hu(self, project_name: str, sprint_name: str, hu_name: str) -> bool:
        """Crea una carpeta de Historia de Usuario (ej: 'CP_HU-123 Login')."""
        try:
            target = self.projects_dir / project_name / sprint_name / hu_name.strip()
            target.mkdir(parents=True, exist_ok=True)
            logger.info(f"HU creada en: {target.relative_to(self.projects_dir)}")
            return True
        except Exception as e:
            logger.error(f"Error al crear HU {hu_name}: {e}")
            return False

    def upload_file_to_hu(self, project_name: str, sprint_name: str, hu_name: str, source_file: str) -> bool:
        """
        Copia un archivo externo hacia la carpeta de la HU.
        Ideal para importar plantillas Excel o Word.
        """
        try:
            source = Path(source_file)
            if not source.exists() or not source.is_file():
                logger.error(f"El archivo fuente no existe: {source_file}")
                return False
                
            dest_dir = self.projects_dir / project_name / sprint_name / hu_name
            if not dest_dir.exists():
                logger.error(f"La carpeta destino no existe: {dest_dir}")
                return False
                
            shutil.copy2(source, dest_dir / source.name)
            logger.info(f"Archivo copiado a: {dest_dir.name}/{source.name}")
            return True
        except Exception as e:
            logger.error(f"Error copiando archivo {source_file}: {e}")
            return False
