"""
ai_annotator.py — Anotación visual basada en coordenadas de IA.

Dibuja bounding boxes, flechas y labels sobre imágenes
usando coordenadas normalizadas (0-1000) de Gemini.
"""

import logging
from pathlib import Path
from typing import List, Tuple

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np
    _CV2_AVAILABLE = True
except ImportError:
    _CV2_AVAILABLE = False


def draw_bounding_box(
    image_path: Path,
    bbox_normalized: List[float],
    output_path: Path = None,
    color: Tuple[int, int, int] = (0, 255, 0),
    thickness: int = 3,
    label: str = None,
) -> bool:
    """
    Dibuja un bounding box sobre una imagen.

    Args:
        image_path: Ruta a la imagen fuente
        bbox_normalized: [ymin, xmin, ymax, xmax] normalizado 0-1000
        output_path: Ruta de salida (si None, sobreescribe la original)
        color: Color BGR del rectángulo
        thickness: Grosor del borde
        label: Texto de etiqueta (opcional)

    Returns:
        True si fue exitoso
    """
    if not _CV2_AVAILABLE:
        logger.error("OpenCV no está disponible")
        return False

    if output_path is None:
        output_path = image_path

    try:
        img = cv2.imread(str(image_path))
        if img is None:
            logger.error(f"No se pudo leer la imagen: {image_path}")
            return False

        h, w = img.shape[:2]
        ymin, xmin, ymax, xmax = bbox_normalized

        # Convertir coordenadas normalizadas (0-1000) a píxeles
        x1 = int(xmin * w / 1000)
        y1 = int(ymin * h / 1000)
        x2 = int(xmax * w / 1000)
        y2 = int(ymax * h / 1000)

        # Dibujar rectángulo semitransparente
        overlay = img.copy()
        cv2.rectangle(overlay, (x1, y1), (x2, y2), color, thickness)
        alpha = 0.15
        fill_overlay = img.copy()
        cv2.rectangle(fill_overlay, (x1, y1), (x2, y2), color, cv2.FILLED)
        cv2.addWeighted(fill_overlay, alpha, img, 1 - alpha, 0, img)
        cv2.rectangle(img, (x1, y1), (x2, y2), color, thickness)

        # Dibujar flecha apuntando al centro del bounding box
        center_x = (x1 + x2) // 2
        center_y = (y1 + y2) // 2
        arrow_start = (x2 + 40, y1 - 40)
        cv2.arrowedLine(img, arrow_start, (center_x, center_y), color, 2, tipLength=0.15)

        # Etiqueta
        if label:
            label_y = max(y1 - 10, 25)
            cv2.putText(
                img, label, (x1, label_y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2,
            )

        output_path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(output_path), img)
        logger.info(f"Anotación guardada: {output_path.name}")
        return True

    except Exception as e:
        logger.error(f"Error anotando imagen: {e}")
        return False


def is_available() -> bool:
    """Verifica si el motor de anotación está disponible."""
    return _CV2_AVAILABLE
