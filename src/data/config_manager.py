"""
config_manager.py — Carga centralizada de archivos de configuración.

Gestiona settings.json y trazabilidad.json de forma unificada.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional, Tuple

logger = logging.getLogger(__name__)


def _load_json(file_path: Path) -> Dict:
    """Carga un archivo JSON con manejo de errores."""
    if not file_path.exists():
        logger.warning(f"Archivo de configuración no encontrado: {file_path}")
        return {}
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error cargando {file_path}: {e}")
        return {}


def _save_json(file_path: Path, data: Dict) -> bool:
    """Guarda un diccionario como JSON."""
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        logger.error(f"Error guardando {file_path}: {e}")
        return False


class ConfigManager:
    """Gestión centralizada de la configuración del proyecto."""

    def __init__(self, base_dir: Path):
        self.base_dir = base_dir
        self.config_dir = base_dir / "config"
        self._settings: Optional[Dict] = None
        self._trazabilidad: Optional[Dict] = None

    @property
    def settings_path(self) -> Path:
        return self.config_dir / "settings.json"

    @property
    def trazabilidad_path(self) -> Path:
        return self.config_dir / "trazabilidad.json"

    def load_settings(self) -> Dict[str, Any]:
        """Carga config/settings.json (con cache en memoria)."""
        if self._settings is None:
            self._settings = _load_json(self.settings_path)
        return self._settings

    def load_trazabilidad(self) -> Dict[str, Dict[str, list]]:
        """Carga config/trazabilidad.json (con cache en memoria)."""
        if self._trazabilidad is None:
            self._trazabilidad = _load_json(self.trazabilidad_path)
        return self._trazabilidad

    def get_video_dir(self) -> Path:
        """Retorna la ruta al directorio de video."""
        settings = self.load_settings()
        return self.base_dir / settings.get("video_dir", "video")

    def get_map_file(self) -> Path:
        """Retorna la ruta al archivo de mapa de imágenes."""
        settings = self.load_settings()
        return self.base_dir / settings.get("map_file", "mapa_imagenes.json")

    def get_hu_folders(self) -> Dict[str, str]:
        """Retorna el mapeo HU ID → ruta de carpeta."""
        settings = self.load_settings()
        return settings.get("hu_folders", {})

    def get_cp_range(self, hu_id: str, cp_id: str) -> Optional[Tuple[int, int]]:
        """Retorna el rango de frames [inicio, fin] para un CP."""
        traz = self.load_trazabilidad()
        hu_map = traz.get(hu_id, {})
        range_val = hu_map.get(cp_id)
        if range_val and isinstance(range_val, (list, tuple)) and len(range_val) == 2:
            return (range_val[0], range_val[1])
        return None

    def update_trazabilidad(self, hu_id: str, cp_ranges: Dict[str, list]) -> bool:
        """Actualiza los rangos de trazabilidad para una HU."""
        traz = self.load_trazabilidad()
        traz[hu_id] = cp_ranges
        success = _save_json(self.trazabilidad_path, traz)
        if success:
            self._trazabilidad = traz
            logger.info(f"Trazabilidad actualizada para {hu_id}")
        return success

    def reload(self):
        """Fuerza recarga de configuración desde disco."""
        self._settings = None
        self._trazabilidad = None
