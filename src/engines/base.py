"""
Interfaces abstractas para motores de procesamiento.

Define los contratos que deben implementar los backends 'local' y 'cloud'.
"""

from abc import ABC, abstractmethod
from pathlib import Path
from dataclasses import dataclass
from typing import List, Dict, Optional


class NarrationEngine(ABC):
    """Genera texto de narración conversacional para un Caso de Prueba."""

    @abstractmethod
    def generate(self, tc, index: int) -> str:
        """
        Genera un párrafo narrativo en español para un CP.

        Args:
            tc: instancia de TestCase (src.data.excel_reader.TestCase)
            index: posición ordinal (1-based) del CP en la guía

        Returns:
            Texto narrativo continuo y fluido en español
        """
        ...

    @property
    @abstractmethod
    def is_available(self) -> bool:
        """Indica si el motor está listo para usarse."""
        ...


@dataclass
class CpDetection:
    """Resultado de detección de un CP en video."""
    cp_id: str
    second: int
    bounding_box: List[float]
    confidence: float = 1.0


class VideoAnalyzer(ABC):
    """Analiza video para detectar momentos clave de Casos de Prueba."""

    @abstractmethod
    def analyze(self, video_path: Path, cp_list: List[Dict]) -> List[CpDetection]:
        """
        Analiza un video y detecta timestamps por CP.

        Args:
            video_path: Ruta al archivo de video
            cp_list: Lista de dicts con 'id', 'nombre', 'resultado_esperado'

        Returns:
            Lista de CpDetection con timestamps y bounding boxes
        """
        ...

    @property
    @abstractmethod
    def is_available(self) -> bool:
        """Indica si el motor está listo para usarse."""
        ...
