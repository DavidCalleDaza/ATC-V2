"""
whisper_engine.py — Motor de transcripción de audio local usando Whisper.

Refactorización de core/audio_processor.py con carga lazy y API limpia.
Funciona completamente offline.
"""

import logging
import warnings
from pathlib import Path
from typing import Tuple, List, Dict, Optional

# Suprimir warnings de FP16 si corre en CPU
warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")

logger = logging.getLogger(__name__)


class WhisperTranscriber:
    """Motor de transcripción de audio local basado en OpenAI Whisper."""

    def __init__(self, model_name: str = "base"):
        """
        Args:
            model_name: Nombre del modelo Whisper ('tiny', 'base', 'small', 'medium', 'large')
        """
        self.model_name = model_name
        self._model = None

    def _load_model(self):
        """Carga lazy del modelo Whisper."""
        if self._model is None:
            logger.info(f"Cargando modelo Whisper '{self.model_name}'... Esto puede tardar unos segundos la primera vez.")
            import whisper
            self._model = whisper.load_model(self.model_name)
        return self._model

    def transcribe(self, media_path: Path) -> Tuple[str, List[Dict]]:
        """
        Transcribe el audio de un archivo de video o audio.

        Args:
            media_path: Ruta al archivo de video (.mp4) o audio (.wav, .mp3)

        Returns:
            Tupla (texto_completo, lista_de_segmentos)
            Cada segmento es un dict con keys: 'start', 'end', 'text'
        """
        try:
            model = self._load_model()
            logger.info(f"Transcribiendo: {media_path.name}")

            result = model.transcribe(str(media_path))
            text = result["text"].strip()
            segments = result.get("segments", [])

            if text:
                logger.info(f"Transcripción exitosa ({len(text)} caracteres, {len(segments)} segmentos)")
                return text, segments
            else:
                logger.info("No se detectó voz o diálogo reconocible.")
                return "", []

        except Exception as e:
            logger.error(f"Error al transcribir {media_path.name}: {e}")
            return "", []

    @property
    def is_available(self) -> bool:
        """Verifica si Whisper está disponible."""
        try:
            import whisper
            return True
        except ImportError:
            return False
