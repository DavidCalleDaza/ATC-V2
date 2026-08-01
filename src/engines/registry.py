"""
Engine Registry — Factory que selecciona motores según ATC_BACKEND.

Uso:
    from src.engines.registry import get_narration_engine
    engine = get_narration_engine()
    texto = engine.generate(tc, 1)

Variable de entorno:
    ATC_BACKEND=local   (default) — 100% offline, sin APIs externas
    ATC_BACKEND=cloud   — requiere GEMINI_API_KEY, usa servicios cloud
"""

import os
import logging

logger = logging.getLogger(__name__)

_BACKEND = os.getenv("ATC_BACKEND", "local").lower()


def get_backend() -> str:
    """Retorna el backend activo: 'local' o 'cloud'."""
    return _BACKEND


def get_narration_engine():
    """
    Retorna una instancia de NarrationEngine según ATC_BACKEND.

    El backend 'cloud' requiere google-genai y GEMINI_API_KEY.
    Si no están disponibles, degrada silenciosamente a local.
    """
    if _BACKEND == "cloud":
        try:
            from src.engines.cloud.gemini_narration import GeminiNarrationEngine
            engine = GeminiNarrationEngine()
            if engine.is_available:
                logger.info("NarrationEngine: cloud (Gemini)")
                return engine
            logger.info("GEMINI_API_KEY no configurada, usando backend local")
        except ImportError:
            logger.info("google-genai no instalado, usando backend local")
        except Exception as e:
            logger.warning(f"Error inicializando backend cloud: {e}")

    from src.engines.local.narration import LocalNarrationEngine
    logger.info("NarrationEngine: local (template-based)")
    return LocalNarrationEngine()


def get_video_analyzer():
    """
    Retorna una instancia de VideoAnalyzer según ATC_BACKEND.

    El backend 'cloud' usa Gemini para detección de CPs en video.
    Por ahora el backend 'local' no tiene implementación de análisis de video.
    """
    if _BACKEND == "cloud":
        try:
            from src.engines.cloud.gemini_analyzer import GeminiVideoAnalyzer
            analyzer = GeminiVideoAnalyzer()
            if analyzer.is_available:
                logger.info("VideoAnalyzer: cloud (Gemini)")
                return analyzer
            logger.info("GEMINI_API_KEY no configurada, análisis de video no disponible")
        except ImportError:
            logger.info("google-genai no instalado, análisis de video no disponible")
        except Exception as e:
            logger.warning(f"Error inicializando VideoAnalyzer cloud: {e}")

    logger.info("VideoAnalyzer: no disponible en backend local")
    return None
