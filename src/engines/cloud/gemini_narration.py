"""
GeminiNarrationEngine — Genera narración conversacional usando Gemini.

Implementación cloud del contrato NarrationEngine.
Requiere: google-genai instalado, GEMINI_API_KEY configurada, ATC_BACKEND=cloud.

Actualmente en espera de activación — el backend local se usa por defecto.
"""

import os
import re
import logging

from src.engines.base import NarrationEngine

logger = logging.getLogger(__name__)


class GeminiNarrationEngine(NarrationEngine):
    """Genera texto narrativo humanizado con Google Gemini."""

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

    def generate(self, tc, index: int) -> str:
        if not self.api_key:
            logger.warning("GEMINI_API_KEY no configurada")
            return self._fallback(tc, index)

        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)

            prompt = _build_prompt(tc)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            narrative = response.text.strip()
            if narrative:
                narrative = re.sub(r'[*#\[\]_<>]', '', narrative)
                return narrative
        except ImportError:
            logger.warning("google-genai no instalado")
        except Exception as e:
            logger.warning(f"Error generando narración con Gemini para {tc.id}: {e}")

        return self._fallback(tc, index)

    @property
    def is_available(self) -> bool:
        if not self.api_key:
            return False
        try:
            from google import genai  # noqa: F401
            return True
        except ImportError:
            return False

    def _fallback(self, tc, index: int) -> str:
        from src.engines.local.narration import LocalNarrationEngine
        return LocalNarrationEngine().generate(tc, index)


def _build_prompt(tc) -> str:
    return f"""Tú eres un experto en Aseguramiento de Calidad (QA) y tienes una voz natural y conversacional.
Dado el siguiente Caso de Prueba (CP), escribe un párrafo de narración continuo, fluido y altamente humano en español, como si le estuvieras explicando en tiempo real a una persona el paso a paso detallado que debe ejecutar en la interfaz del sistema.

Reglas:
1. No uses listas, viñetas ni formato Markdown seco (como **Precondiciones:** o **Resultado esperado:**). Debe ser un párrafo narrativo único y continuo.
2. Utiliza conectores verbales fluidos y naturales en español (por ejemplo: "Para comenzar con la prueba...", "Ahora dirígete a...", "Una vez que ingreses...", "Deberías ver que...").
3. Integra de forma natural y coherente: el nombre de la prueba, las precondiciones, los pasos de ejecución y el resultado esperado.
4. Mantén el tono profesional pero cercano y natural, como un guía de software humano.

Datos del caso de prueba:
- ID: {tc.id}
- Nombre de la prueba: {tc.nombre}
- Precondiciones: {tc.precondiciones or 'Ninguna'}
- Pasos a ejecutar: {tc.pasos or 'Ninguno'}
- Resultado esperado: {tc.resultado_esperado or 'Ninguno'}

Responde únicamente con el párrafo de narración sugerido en español, sin preámbulos ni explicaciones adicionales."""
