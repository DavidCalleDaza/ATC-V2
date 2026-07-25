"""
gemini_analyzer.py — Análisis de video con IA Gemini.

Refactorización de scripts/analizar_videos_ai.py.
Sube video a servidores de Google, obtiene timestamps y bounding boxes por CP.
"""

import os
import time
import json
import logging
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class CpDetection:
    """Resultado de detección de un CP por Gemini."""
    cp_id: str
    second: int
    bounding_box: List[float]  # [ymin, xmin, ymax, xmax] normalizado 0-1000
    confidence: float = 1.0


class GeminiVideoAnalyzer:
    """Analiza video con Google Gemini para detectar momentos clave de CPs."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Args:
            api_key: API key de Gemini. Si None, lee de GEMINI_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY no configurada")
        self._client = None

    def _init_client(self):
        """Inicializa el cliente de Gemini."""
        if self._client is None:
            from google import genai
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def analyze_video(
        self,
        video_path: Path,
        cp_list: List[Dict],
        model: str = "gemini-2.0-flash"
    ) -> List[CpDetection]:
        """
        Sube video a Gemini y solicita detección de CPs.

        Args:
            video_path: Ruta al video MP4
            cp_list: Lista de dicts con 'id', 'nombre', 'resultado_esperado'
            model: Modelo de Gemini a usar

        Returns:
            Lista de CpDetection con timestamps y bounding boxes
        """
        client = self._init_client()

        # 1. Subir video
        logger.info(f"Subiendo video a servidores de Gemini: {video_path.name}")
        uploaded_file = client.files.upload(file=video_path)
        logger.info(f"Video subido: {uploaded_file.name}")

        # Esperar a que el video esté procesado
        while uploaded_file.state.name == "PROCESSING":
            time.sleep(5)
            uploaded_file = client.files.get(name=uploaded_file.name)

        if uploaded_file.state.name != "ACTIVE":
            logger.error(f"Video no se procesó correctamente: {uploaded_file.state.name}")
            return []

        # 2. Construir prompt
        cp_text = "\n".join([
            f"  - ID: {cp['id']}, Nombre: \"{cp['nombre']}\", Resultado Esperado: \"{cp.get('resultado_esperado', '')}\""
            for cp in cp_list
        ])

        prompt = f"""Analiza este video de una ejecución de pruebas de software.
Identifica el momento exacto (en segundos) donde se ejecuta cada Caso de Prueba (CP) y
dibuja un bounding box sobre el elemento más relevante de la pantalla.

Casos de Prueba a detectar:
{cp_text}

IMPORTANTE: Responde SOLO con un JSON válido (sin markdown), con esta estructura:
[
  {{
    "cp_id": "CP_001",
    "segundo_exacto": 45,
    "bounding_box": [ymin, xmin, ymax, xmax]
  }}
]

Los valores del bounding_box deben estar normalizados de 0 a 1000
(donde 0 es la esquina superior izquierda y 1000 la inferior derecha).
Si no puedes detectar un CP, omítelo del JSON."""

        # 3. Enviar a Gemini
        logger.info("Enviando prompt a Gemini...")
        response = client.models.generate_content(
            model=model,
            contents=[uploaded_file, prompt]
        )

        # 4. Parsear respuesta
        detections = self._parse_response(response.text)

        # 5. Limpiar: eliminar video de servidores
        try:
            client.files.delete(name=uploaded_file.name)
            logger.info("Video eliminado de servidores de Gemini")
        except Exception as e:
            logger.warning(f"No se pudo eliminar el video: {e}")

        return detections

    def _parse_response(self, raw_text: str) -> List[CpDetection]:
        """Parsea la respuesta JSON de Gemini."""
        try:
            # Limpiar posibles markdown wrappers
            text = raw_text.strip()
            if text.startswith("```"):
                text = text.split("\n", 1)[1]
                text = text.rsplit("```", 1)[0]

            items = json.loads(text)
            detections = []
            for item in items:
                det = CpDetection(
                    cp_id=item["cp_id"],
                    second=int(item["segundo_exacto"]),
                    bounding_box=item["bounding_box"],
                )
                detections.append(det)
                logger.info(f"  Detectado {det.cp_id} en segundo {det.second}")

            return detections
        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Error parseando respuesta de Gemini: {e}")
            logger.debug(f"Respuesta raw: {raw_text[:500]}")
            return []

    @property
    def is_available(self) -> bool:
        """Verifica si Gemini está configurado."""
        return bool(self.api_key)
