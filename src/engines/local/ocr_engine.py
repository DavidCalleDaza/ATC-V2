"""
ocr_engine.py — Motor de OCR local usando pytesseract + OpenCV.

Refactorización del OCR disperso en scripts/analizar_videos.py
y scripts/extract_ocr_text.py en una API unificada.
"""

import logging
from pathlib import Path
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

# Intentar importar dependencias opcionales
try:
    import cv2
    import pytesseract
    _OCR_AVAILABLE = True
except ImportError:
    _OCR_AVAILABLE = False
    logger.warning("OCR no disponible: instala opencv-python-headless y pytesseract")


# Píxeles superiores a ignorar (URL bar, tabs del navegador)
TOP_CHROME_MARGIN = 150

# Palabras comunes en español que no aportan al matching visual
STOP_WORDS = {
    'de', 'la', 'el', 'en', 'es', 'un', 'una', 'para', 'que', 'se', 'con',
    'del', 'los', 'las', 'por', 'al', 'no', 'si', 'su', 'le', 'ya', 'pero',
    'sin', 'como', 'todo', 'esta', 'este', 'cada', 'más', 'fue', 'son', 'hay',
    'has', 'ser', 'sus', 'nos', 'les', 'cual', 'uno', 'dos', 'tres'
}


def preprocess_for_ocr(image_path: Path):
    """
    Binariza la imagen para mejorar el OCR de textos pequeños de UI.
    Retorna la imagen procesada como array de OpenCV.
    """
    if not _OCR_AVAILABLE:
        raise RuntimeError("OpenCV no está instalado")

    img = cv2.imread(str(image_path))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.convertScaleAbs(gray, alpha=1.5, beta=0)
    _, bin_img = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return bin_img


def extract_text(image_path: Path, lang: str = "spa") -> str:
    """
    Extrae texto de una imagen usando OCR.

    Args:
        image_path: Ruta a la imagen
        lang: Idioma de Tesseract ('spa' para español)

    Returns:
        Texto extraído limpio
    """
    if not _OCR_AVAILABLE:
        logger.error("OCR no disponible")
        return ""

    try:
        bin_img = preprocess_for_ocr(image_path)
        text = pytesseract.image_to_string(bin_img, lang=lang)
        return " ".join(text.split())
    except Exception as e:
        logger.error(f"Error OCR en {image_path}: {e}")
        return ""


def extract_text_with_positions(image_path: Path, lang: str = "spa") -> List[Dict]:
    """
    Extrae texto con posiciones (bounding boxes) para anotación.

    Args:
        image_path: Ruta a la imagen
        lang: Idioma de Tesseract

    Returns:
        Lista de dicts con keys: text, x, y, w, h, conf, block_num, par_num
    """
    if not _OCR_AVAILABLE:
        logger.error("OCR no disponible")
        return []

    try:
        img = cv2.imread(str(image_path))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        data = pytesseract.image_to_data(gray, lang=lang, output_type=pytesseract.Output.DICT)

        results = []
        n_boxes = len(data['level'])
        for i in range(n_boxes):
            word = str(data['text'][i]).strip()
            conf = int(data['conf'][i])
            if not word or conf < 40:
                continue

            results.append({
                'text': word,
                'x': data['left'][i],
                'y': data['top'][i],
                'w': data['width'][i],
                'h': data['height'][i],
                'conf': conf,
                'block_num': data['block_num'][i],
                'par_num': data['par_num'][i],
            })

        return results
    except Exception as e:
        logger.error(f"Error OCR con posiciones en {image_path}: {e}")
        return []


def is_available() -> bool:
    """Verifica si el motor OCR está disponible."""
    return _OCR_AVAILABLE
