"""
frame_extractor.py — Extracción de frames de video con ffmpeg.

Consolida la lógica de extracción de frames dispersa en
analizar_videos.py y analizar_videos_ai.py.
"""

import logging
import subprocess
from pathlib import Path
from typing import List, Optional

logger = logging.getLogger(__name__)

_ffmpeg_available: Optional[bool] = None


def extract_frames_fps(video_path: Path, output_dir: Path, fps: int = 1) -> List[Path]:
    """
    Extrae frames del video a N frames por segundo.

    Args:
        video_path: Ruta al archivo de video
        output_dir: Directorio de salida para los frames
        fps: Frames por segundo a extraer (default: 1)

    Returns:
        Lista de rutas a los frames extraídos, ordenados
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    logger.info(f"Extrayendo frames de {video_path.name} ({fps} FPS)...")
    cmd = [
        "ffmpeg",
        "-i", str(video_path),
        "-vf", f"fps={fps}",
        "-loglevel", "error",
        str(output_dir / "frame_%04d.png")
    ]

    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        logger.error(f"Error extrayendo frames: {e}")
        return []
    except FileNotFoundError:
        logger.error("ffmpeg no está instalado")
        return []

    frames = sorted(output_dir.glob("*.png"))
    logger.info(f"Se extrajeron {len(frames)} frames.")
    return frames


def is_available() -> bool:
    """Verifica si ffmpeg está disponible (con cache)."""
    global _ffmpeg_available
    if _ffmpeg_available is not None:
        return _ffmpeg_available
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, timeout=5)
        _ffmpeg_available = True
    except (FileNotFoundError, subprocess.TimeoutExpired):
        _ffmpeg_available = False
    return _ffmpeg_available
