"""
LocalNarrationEngine — Genera narración conversacional usando plantillas.

Implementación 100% local del contrato NarrationEngine.
No requiere APIs externas ni conexión a internet.
"""

import logging

from src.engines.base import NarrationEngine

logger = logging.getLogger(__name__)


class LocalNarrationEngine(NarrationEngine):
    """Genera texto narrativo con plantillas conversacionales en español."""

    def generate(self, tc, index: int) -> str:
        """Formatea un CP en un párrafo conversacional fluido en español."""

        if tc.precondiciones:
            pre_clean = tc.precondiciones.strip().rstrip('.')
        else:
            pre_clean = ""

        if tc.pasos:
            steps_clean = tc.pasos.strip().rstrip('.')
        else:
            steps_clean = ""

        if tc.resultado_esperado:
            res_clean = tc.resultado_esperado.strip().rstrip('.')
        else:
            res_clean = ""

        if index == 1:
            intro = f"Para iniciar con el caso de prueba {tc.id}, titulado '{tc.nombre}'"
        else:
            intros = [
                f"Siguiendo con el caso de prueba {tc.id}, '{tc.nombre}'",
                f"Ahora pasamos al escenario {tc.id}, para '{tc.nombre}'",
                f"A continuación, realizaremos la prueba {tc.id}, correspondiente a '{tc.nombre}'",
                f"El siguiente paso es la ejecución de {tc.id}, '{tc.nombre}'",
            ]
            intro = intros[(index - 2) % len(intros)]

        parts = [intro + ". "]

        if pre_clean:
            parts.append(
                f"Antes de comenzar, asegúrate de cumplir con las precondiciones, "
                f"las cuales son: {pre_clean}. "
            )

        if steps_clean:
            parts.append(
                f"Para llevar a cabo este escenario, realiza las siguientes acciones "
                f"en la interfaz: {steps_clean}. "
            )

        if res_clean:
            parts.append(
                f"Al finalizar, deberías poder observar como resultado que {res_clean}. "
            )

        return "".join(parts)

    @property
    def is_available(self) -> bool:
        return True
