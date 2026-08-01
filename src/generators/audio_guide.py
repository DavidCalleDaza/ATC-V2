"""
audio_guide.py — Generador de audio-guía para ejecución de pruebas.

Pipeline completo:
1. Escanea user_stories/ buscando HUs
2. Lee Excel (hoja DiseñoEjecución, fila 07)
3. Filtra CPs positivos por heurística
4. Genera guión narrativo coherente (.md)
5. Convierte a audio (.wav) con Piper TTS
"""

import re
import logging
from pathlib import Path
from typing import List, Optional

from src.data.excel_reader import read_positive_test_cases
from src.data.story_scanner import (
    scan_sprints, scan_hu_folders, find_hu_folder,
    scan_all_hu_folders, HuFolder
)
from src.engines.local.tts_engine import PiperTTS
from src.engines.registry import get_narration_engine

logger = logging.getLogger(__name__)


class AudioGuideGenerator:
    """Genera audio-guías narradas para la ejecución de pruebas de QA."""

    def __init__(self, base_dir: Path, tts_models_dir: Optional[Path] = None, tts_cache_dir: Optional[Path] = None):
        """
        Args:
            base_dir: Directorio raíz del proyecto
            tts_models_dir: Directorio con modelos Piper TTS (default: recorder/tts-models/)
            tts_cache_dir: Directorio de cache TTS (default: recorder/tts-cache/)
        """
        self.base_dir = base_dir
        self.output_dir = base_dir / "audio_guides"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        self.narration = get_narration_engine()

        # Configurar TTS
        if tts_models_dir is None:
            tts_models_dir = base_dir / "recorder" / "tts-models"
        if tts_cache_dir is None:
            tts_cache_dir = base_dir / "recorder" / "tts-cache"

        self.tts = PiperTTS(models_dir=tts_models_dir, cache_dir=tts_cache_dir)

    # ── Generación de guión narrativo ──────────────────────────────────────────

    @staticmethod
    def _clean_text_for_narration(text: str) -> str:
        """Limpia texto para que sea narrado correctamente por TTS."""
        if not text:
            return ""
        # Reemplazar saltos de línea con puntos
        text = re.sub(r'\n+', '. ', text)
        # Remover caracteres especiales que confunden al TTS
        text = re.sub(r'[_*#\[\]{}|<>]', '', text)
        # Normalizar espacios
        text = re.sub(r'\s+', ' ', text)
        # Asegurar que termina con punto
        text = text.strip()
        if text and not text[-1] in '.!?':
            text += '.'
        return text

    def generate_script_md(self, hu_folder: HuFolder) -> Optional[Path]:
        """
        Genera el guión narrativo en formato Markdown para una HU.

        Args:
            hu_folder: Metadata de la carpeta de HU

        Returns:
            Path al archivo .md generado, o None si falló
        """
        if not hu_folder.has_excel:
            logger.warning(f"Sin archivo Excel para {hu_folder.hu_id}")
            return None

        # Leer CPs positivos
        positive_cps = read_positive_test_cases(hu_folder.path)
        if not positive_cps:
            logger.warning(f"No se encontraron CPs positivos para {hu_folder.hu_id}")
            return None

        # Obtener nombre de la HU del primer CP
        hu_name = positive_cps[0].hu_nombre or hu_folder.folder_name
        hu_name = re.sub(r'^CP_', '', hu_name)

        # Construir guión
        lines = []
        lines.append(f"# Guía de Ejecución: {hu_folder.hu_id} {hu_name}")
        lines.append("")
        lines.append("## Flujo Completo de Escenarios Positivos")
        lines.append("")
        lines.append(f"Esta guía describe el flujo de punta a punta para la historia de usuario {hu_folder.hu_id}.")
        lines.append(f"Se abordan {len(positive_cps)} escenarios positivos que cubren el camino feliz de la funcionalidad.")
        lines.append("")
        lines.append("---")
        lines.append("")

        for i, tc in enumerate(positive_cps, 1):
            lines.append(f"### Paso {i}: {tc.id} — {tc.nombre}")
            lines.append("")

            # Generar párrafo narrativo fluido (backend seleccionado vía ATC_BACKEND)
            human_narrative = self.narration.generate(tc, i)
            lines.append(human_narrative)
            lines.append("")
            lines.append("---")
            lines.append("")

        lines.append("## Fin de la Guía")
        lines.append("")
        lines.append(f"Se completaron los {len(positive_cps)} escenarios positivos de {hu_folder.hu_id}.")
        lines.append("")

        # Guardar .md
        md_path = hu_folder.path / f"{hu_folder.hu_id}_guide.md"

        with open(md_path, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))

        logger.info(f"Guión generado: {md_path}")
        return md_path

    # ── Conversión a audio ─────────────────────────────────────────────────────

    def _extract_segments(self, content: str) -> list[str]:
        """Extrae segmentos de narración agrupados por Casos de Prueba para sincronizar con la UI."""
        blocks = content.split('### Paso')
        segments = []
        for i, block in enumerate(blocks):
            lines = []
            for line in block.splitlines():
                line = line.strip()
                if line and not line.startswith('#') and not line.startswith('---'):
                    clean = line.replace('**', '').replace('*', '')
                    if clean:
                        lines.append(clean)
            if lines:
                segments.append(" ".join(lines))
            elif i == 0:
                # Salvaguarda: mantener sincronización con UI si la intro carece de texto narrable
                segments.append("Comenzando la guía de ejecución.")
        return segments

    def _md_to_narration_segments(self, md_path: Path) -> List[str]:
        """
        Convierte el guión Markdown en segmentos de texto listo para TTS.
        Cada segmento corresponde a una sección lógica (intro, paso, cierre).
        """
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()

        segments = self._extract_segments(content)
        
        logger.info(f"Se extrajeron {len(segments)} segmentos de narración")
        return segments

    def generate_audio(self, hu_folder: HuFolder, force: bool = False) -> Optional[Path]:
        """
        Pipeline completo: genera guión MD → convierte a audio WAV.

        Args:
            hu_folder: Metadata de la carpeta de HU
            force: Si True, regenera aunque ya existan los archivos

        Returns:
            Path al archivo .wav generado, o None si falló
        """
        wav_path = hu_folder.path / f"{hu_folder.hu_id}_guide.wav"
        md_path = hu_folder.path / f"{hu_folder.hu_id}_guide.md"

        # Verificar si ya existe (skip si no es forzado)
        if not force and wav_path.exists() and md_path.exists():
            logger.info(f"Audio-guía ya existe para {hu_folder.hu_id}, omitiendo (usa --force para regenerar)")
            return wav_path

        # 1. Generar guión .md
        md_result = self.generate_script_md(hu_folder)
        if not md_result:
            return None

        # 2. Verificar TTS disponible
        if not self.tts.is_available:
            logger.error(
                "Motor TTS (Piper) no disponible. "
                "Se generó el guión .md pero no se pudo crear el audio. "
                "Verifica que 'piper' esté instalado y los modelos en recorder/tts-models/"
            )
            return None

        # 3. Extraer segmentos de narración
        segments = self._md_to_narration_segments(md_result)
        if not segments:
            logger.error("No se extrajeron segmentos para narración")
            return None

        # 4. Generar audio concatenado
        logger.info(f"Generando audio ({len(segments)} segmentos)...")
        success, durations = self.tts.generate_concatenated_audio(segments, wav_path)

        if success:
            logger.info(f"✓ Audio-guía generado: {wav_path}")
            
            # Guardar metadata de duraciones para la UI
            import json
            meta_path = wav_path.with_suffix('.json')
            with open(meta_path, 'w', encoding='utf-8') as f:
                json.dump({"durations": durations}, f)
                
            return wav_path
        else:
            logger.error(f"✗ Falló la generación de audio para {hu_folder.hu_id}")
            return None

    # ── API de alto nivel ──────────────────────────────────────────────────────

    def generate_for_hu(self, hu_id: str, project_name: str = None, force: bool = False) -> Optional[Path]:
        """Genera audio-guía para una HU específica por ID."""
        hu_folder = find_hu_folder(self.base_dir, hu_id, project_name)
        if not hu_folder:
            logger.error(f"No se encontró carpeta para {hu_id}")
            return None
        return self.generate_audio(hu_folder, force=force)

    def generate_for_sprint(self, sprint: str, force: bool = False) -> List[Path]:
        """Genera audio-guías para todas las HUs de un sprint."""
        folders = scan_hu_folders(self.base_dir, sprint)
        results = []
        for hu in folders:
            if not hu.has_excel:
                logger.warning(f"Omitiendo {hu.hu_id}: sin archivo Excel")
                continue
            result = self.generate_audio(hu, force=force)
            if result:
                results.append(result)
        logger.info(f"Sprint {sprint}: {len(results)} audio-guías generadas de {len(folders)} HUs")
        return results

    def generate_all(self, force: bool = False) -> List[Path]:
        """Genera audio-guías para TODAS las HUs de todos los sprints."""
        all_folders = scan_all_hu_folders(self.base_dir)
        results = []
        for hu in all_folders:
            if not hu.has_excel:
                continue
            result = self.generate_audio(hu, force=force)
            if result:
                results.append(result)
        logger.info(f"Total: {len(results)} audio-guías generadas de {len(all_folders)} HUs")
        return results

    def list_existing_guides(self) -> List[dict]:
        """Lista todas las guías de audio ya generadas en projects/."""
        from src.data.story_scanner import scan_all_hu_folders
        guides = []
        for hu in scan_all_hu_folders(self.base_dir):
            wav = hu.path / f"{hu.hu_id}_guide.wav"
            md = hu.path / f"{hu.hu_id}_guide.md"
            if wav.exists():
                guides.append({
                    "hu_id": hu.hu_id,
                    "sprint": hu.sprint,
                    "wav_path": wav,
                    "md_path": md if md.exists() else None,
                    "wav_size_kb": wav.stat().st_size // 1024,
                })
        return guides
