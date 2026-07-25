"""
image_dedup.py — Deduplicación de frames de video.

Refactorización de scripts/analyze_discard_duplicates.py.
Identifica duplicados exactos (MD5) y fotogramas estáticos consecutivos (MSE).
"""

import re
import hashlib
import logging
import shutil
from pathlib import Path
from typing import Dict, Tuple, List

logger = logging.getLogger(__name__)

try:
    from PIL import Image
    import numpy as np
    _DEDUP_AVAILABLE = True
except ImportError:
    _DEDUP_AVAILABLE = False


def _get_sorted_scene_files(video_dir: Path) -> List[Tuple[int, Path]]:
    """Obtiene los archivos de escena ordenados numéricamente."""
    files = []
    for f in video_dir.iterdir():
        if f.is_file() and not f.name.startswith('.'):
            m = re.search(r'scene0*(\d+)', f.name, re.IGNORECASE)
            if m:
                files.append((int(m.group(1)), f))
    files.sort(key=lambda x: x[0])
    return files


def deduplicate_frames(
    video_dir: Path,
    mse_threshold: float = 0.5,
    backup_dir_name: str = "descartadas",
    dry_run: bool = False
) -> Dict:
    """
    Analiza y deduplica frames en un directorio.

    Args:
        video_dir: Directorio con las imágenes
        mse_threshold: Umbral MSE para fotogramas estáticos (default: 0.5)
        backup_dir_name: Nombre de la carpeta de respaldo
        dry_run: Si True, no mueve archivos

    Returns:
        Dict con estadísticas y mapas de reemplazo
    """
    if not _DEDUP_AVAILABLE:
        raise RuntimeError("Pillow y numpy son necesarios para deduplicación")

    scene_files = _get_sorted_scene_files(video_dir)
    total = len(scene_files)
    logger.info(f"Analizando {total} imágenes en {video_dir}")

    # 1. Duplicados exactos por MD5
    md5_dict = {}
    exact_duplicates = {}
    for _, filepath in scene_files:
        h = hashlib.md5(filepath.read_bytes()).hexdigest()
        if h in md5_dict:
            exact_duplicates[filepath.name] = md5_dict[h]
        else:
            md5_dict[h] = filepath.name

    # 2. Fotogramas consecutivos estáticos (MSE < threshold)
    consecutive_dups = {}
    prev_arr, prev_canonical = None, None
    for _, filepath in scene_files:
        if filepath.name in exact_duplicates:
            continue
        try:
            arr = np.array(Image.open(filepath).convert('RGB'), dtype=np.float32)
            if prev_arr is not None and arr.shape == prev_arr.shape:
                mse = float(np.mean((arr - prev_arr) ** 2))
                if mse < mse_threshold:
                    consecutive_dups[filepath.name] = (prev_canonical, mse)
                else:
                    prev_arr, prev_canonical = arr, filepath.name
            else:
                prev_arr, prev_canonical = arr, filepath.name
        except Exception as e:
            logger.warning(f"Error procesando {filepath.name}: {e}")

    # Construir mapa de reemplazos
    image_map = {}
    for dup, orig in exact_duplicates.items():
        image_map[dup] = orig
    for dup, (orig, _) in consecutive_dups.items():
        image_map[dup] = orig

    discarded = len(image_map)

    # Mover duplicados si no es dry_run
    if not dry_run and discarded > 0:
        backup_dir = video_dir / backup_dir_name
        backup_dir.mkdir(exist_ok=True)
        moved = 0
        for dup_name in image_map:
            src = video_dir / dup_name
            if src.exists():
                shutil.move(str(src), str(backup_dir / dup_name))
                moved += 1
        logger.info(f"Movidos {moved} archivos a {backup_dir}")

    result = {
        "total_images": total,
        "exact_duplicates": len(exact_duplicates),
        "static_duplicates": len(consecutive_dups),
        "total_discarded": discarded,
        "unique_retained": total - discarded,
        "image_map": image_map,
    }

    logger.info(
        f"Deduplicación: {total} originales → {result['unique_retained']} únicas "
        f"({discarded} descartadas: {len(exact_duplicates)} exactas + {len(consecutive_dups)} estáticas)"
    )
    return result


def generate_image_map(video_dir: Path) -> Dict[str, str]:
    """Genera el mapa de equivalencias sin mover archivos."""
    result = deduplicate_frames(video_dir, dry_run=True)
    return result.get("image_map", {})
