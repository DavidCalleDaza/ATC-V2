"""
excel_reader.py — Capa de datos para lectura de archivos Excel de Historias de Usuario.

Refactorización de core/excel_parser.py con funcionalidad extendida:
- Lectura con columnas fijas de la plantilla DiseñoEjecución
- Filtrado heurístico de CPs positivos/negativos
"""

import re
import logging
import pandas as pd
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional

logger = logging.getLogger(__name__)

# ── Columnas fijas de la plantilla (fila 07 de DiseñoEjecución) ────────────────
FIXED_COLUMNS = [
    "Id Historia de Usuario",
    "Historia de usuario",
    "Id Caso de prueba",
    "Contexto",
    "Nombre del caso de prueba",
    "Resumen",
    "Precondiciones",
    "Pasos",
    "Resultado esperado",
]

# ── Patrones heurísticos para detectar CPs negativos ──────────────────────────
NEGATIVE_PATTERNS = [
    r"\berror\b",
    r"\bmensaje\s+de\s+error\b",
    r"\bno\s+permite\b",
    r"\bno\s+debe\b",
    r"\bno\s+se\s+permite\b",
    r"\binv[aá]lido\b",
    r"\bincorrect[oa]?\b",
    r"\brechaz",
    r"\bfallo\b",
    r"\bfalla\b",
    r"\bbloqueado\b",
    r"\bno\s+deber[ií]a\b",
    r"\bimpide\b",
    r"\brestricción\b",
    r"\brestriccion\b",
]
_NEGATIVE_RE = re.compile("|".join(NEGATIVE_PATTERNS), re.IGNORECASE)


@dataclass
class TestCase:
    """Representa un Caso de Prueba individual."""
    id: str
    nombre: str = ""
    resumen: str = ""
    precondiciones: str = ""
    pasos: str = ""
    resultado_esperado: str = ""
    contexto: str = ""
    hu_id: str = ""
    hu_nombre: str = ""
    is_positive: bool = True


def _find_target_sheet(xls: pd.ExcelFile) -> Optional[str]:
    """Busca la hoja DiseñoEjecución o variantes."""
    for name in xls.sheet_names:
        lower = name.lower()
        if "diseño" in lower or "ejecuci" in lower or "diseñoejecuci" in lower:
            return name
    # Fallback: primera hoja
    if xls.sheet_names:
        return xls.sheet_names[0]
    return None


def _find_excel_file(folder_path: Path) -> Optional[Path]:
    """Encuentra el archivo Excel válido en la carpeta."""
    xlsx_files = [
        f for f in folder_path.glob("*.xlsx")
        if not f.name.startswith("~$") and not f.name.startswith(".")
    ]
    if not xlsx_files:
        return None
    return xlsx_files[0]


def _clean_str(value) -> str:
    """Limpia un valor de celda a string, manejando NaN."""
    if pd.isna(value):
        return ""
    return str(value).strip()


def _is_negative_cp(nombre: str, resultado: str) -> bool:
    """Determina si un CP es negativo basado en heurística de texto."""
    text = f"{nombre} {resultado}"
    return bool(_NEGATIVE_RE.search(text))


# ── API Pública ────────────────────────────────────────────────────────────────

def read_hu_excel(folder_path: Path) -> pd.DataFrame:
    """
    Lectura básica del Excel (compatibilidad con core/excel_parser.py).
    Retorna un DataFrame con header en fila 6 (0-indexed).
    """
    excel_file = _find_excel_file(Path(folder_path))
    if not excel_file:
        logger.warning(f"No se encontraron archivos Excel en {folder_path}")
        return pd.DataFrame()

    logger.info(f"Leyendo Excel: {excel_file.name}")
    try:
        xls = pd.ExcelFile(excel_file)
        target_sheet = _find_target_sheet(xls)
        if not target_sheet:
            logger.warning(f"No se encontró hoja válida en {excel_file.name}")
            return pd.DataFrame()

        df = pd.read_excel(excel_file, sheet_name=target_sheet, header=6)
        df = df.dropna(how="all")
        df.columns = df.columns.str.strip()
        return df
    except Exception as e:
        logger.error(f"Error al leer el archivo Excel {excel_file.name}: {e}")
        return pd.DataFrame()


def read_hu_excel_with_details(folder_path: Path) -> List[TestCase]:
    """
    Lee el Excel y retorna una lista de TestCase con todos los campos
    de las columnas fijas de la plantilla.
    """
    df = read_hu_excel(folder_path)
    if df.empty:
        return []

    test_cases = []
    for _, row in df.iterrows():
        cp_id = _clean_str(row.get("Id Caso de prueba", ""))
        if not cp_id or cp_id.lower() == "nan":
            continue

        nombre = _clean_str(row.get("Nombre del caso de prueba", ""))
        resultado = _clean_str(row.get("Resultado esperado", ""))

        tc = TestCase(
            id=cp_id,
            nombre=nombre,
            resumen=_clean_str(row.get("Resumen", "")),
            precondiciones=_clean_str(row.get("Precondiciones", "")),
            pasos=_clean_str(row.get("Pasos", "")),
            resultado_esperado=resultado,
            contexto=_clean_str(row.get("Contexto", "")),
            hu_id=_clean_str(row.get("Id Historia de Usuario", "")),
            hu_nombre=_clean_str(row.get("Historia de usuario", "")),
            is_positive=not _is_negative_cp(nombre, resultado),
        )
        test_cases.append(tc)

    logger.info(
        f"Se leyeron {len(test_cases)} CPs "
        f"({sum(1 for tc in test_cases if tc.is_positive)} positivos, "
        f"{sum(1 for tc in test_cases if not tc.is_positive)} negativos)"
    )
    return test_cases


def read_positive_test_cases(folder_path: Path) -> List[TestCase]:
    """
    Lee el Excel y retorna solo los CPs clasificados como positivos
    según la heurística de patrones negativos.
    """
    all_cases = read_hu_excel_with_details(folder_path)
    positive = [tc for tc in all_cases if tc.is_positive]
    logger.info(f"CPs positivos filtrados: {len(positive)} de {len(all_cases)} totales")
    return positive
