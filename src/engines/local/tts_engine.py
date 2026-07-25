"""
tts_engine.py — Motor de Text-to-Speech local usando Piper.

Genera archivos .wav desde texto en español, con cache MD5.
Funciona completamente offline sin conexión a internet.
"""

import os
import hashlib
import logging
import subprocess
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


class PiperTTS:
    """Motor TTS local basado en Piper (offline)."""

    def __init__(self, models_dir: Path, cache_dir: Optional[Path] = None):
        """
        Args:
            models_dir: Directorio con archivos .onnx y .onnx.json del modelo
            cache_dir: Directorio para cache de audio generado (opcional)
        """
        self.models_dir = Path(models_dir)
        self.cache_dir = Path(cache_dir) if cache_dir else self.models_dir.parent / "tts-cache"
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        self._model_path: Optional[Path] = None
        self._config_path: Optional[Path] = None
        
        import shutil
        self.piper_cmd = shutil.which("piper")
        if not self.piper_cmd:
            local_bin = os.path.expanduser("~/.local/bin/piper")
            if os.path.exists(local_bin):
                self.piper_cmd = local_bin
            else:
                self.piper_cmd = "piper"

        self._detect_model()

    def _detect_model(self):
        """Auto-detecta el modelo de voz .onnx en el directorio."""
        if not self.models_dir.exists():
            logger.warning(f"Directorio de modelos TTS no existe: {self.models_dir}")
            return

        for f in self.models_dir.iterdir():
            if f.suffix == '.onnx' and not f.name.endswith('.onnx.json'):
                self._model_path = f
                self._config_path = f.parent / (f.name + '.json')
                logger.info(f"Modelo TTS detectado: {f.name}")
                return

        logger.warning("No se encontró modelo .onnx en el directorio de modelos TTS")

    @property
    def is_available(self) -> bool:
        """Verifica si el motor TTS está disponible (modelo + piper instalado)."""
        if not self._model_path or not self._model_path.exists():
            return False
        try:
            result = subprocess.run(
                [self.piper_cmd, "--help"],
                capture_output=True, timeout=5
            )
            return True
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return False

    @staticmethod
    def _text_hash(text: str) -> str:
        """Genera hash MD5 del texto para cache."""
        return hashlib.md5(text.encode('utf-8')).hexdigest()

    def generate_audio(self, text: str, output_path: Path) -> bool:
        """
        Genera un archivo .wav desde texto.

        Args:
            text: Texto a convertir en audio
            output_path: Ruta del archivo .wav de salida

        Returns:
            True si la generación fue exitosa
        """
        if not self._model_path:
            logger.error("No hay modelo TTS disponible")
            return False

        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            proc = subprocess.Popen(
                [
                    self.piper_cmd,
                    "--model", str(self._model_path),
                    "--config", str(self._config_path),
                    "--output_file", str(output_path),
                ],
                stdin=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            stderr_data = b""
            proc.stdin.write(text.encode('utf-8'))
            proc.stdin.close()
            stderr_data = proc.stderr.read()
            proc.wait()

            if proc.returncode == 0 and output_path.exists():
                logger.info(f"Audio generado: {output_path.name} ({output_path.stat().st_size} bytes)")
                return True
            else:
                logger.error(f"Piper exit code {proc.returncode}: {stderr_data.decode('utf-8', errors='replace')}")
                return False

        except FileNotFoundError:
            logger.error("El comando 'piper' no está instalado. Instala con: pip3 install piper-tts")
            return False
        except Exception as e:
            logger.error(f"Error generando audio: {e}")
            return False

    def generate_audio_cached(self, text: str) -> Optional[Path]:
        """
        Genera audio con cache MD5. Si el texto ya fue generado antes,
        retorna la ruta cacheada directamente.

        Args:
            text: Texto a convertir en audio

        Returns:
            Path al archivo .wav generado, o None si falló
        """
        text_hash = self._text_hash(text)
        cache_path = self.cache_dir / f"{text_hash}.wav"

        if cache_path.exists():
            logger.debug(f"Cache hit para TTS: {text_hash}")
            return cache_path

        if self.generate_audio(text, cache_path):
            return cache_path
        return None

    def generate_concatenated_audio(self, segments: list, output_path: Path) -> tuple[bool, list]:
        """
        Genera múltiples segmentos de audio y los concatena en un único .wav.

        Args:
            segments: Lista de strings de texto a narrar secuencialmente
            output_path: Ruta del archivo .wav final concatenado

        Returns:
            (success, durations): Tupla con el booleano de éxito y lista de duraciones (segundos)
        """
        if not segments:
            logger.warning("No hay segmentos de texto para generar audio")
            return False, []

        temp_files = []
        try:
            # Generar cada segmento individualmente
            for i, text in enumerate(segments):
                segment_path = self.generate_audio_cached(text)
                if segment_path:
                    temp_files.append(segment_path)
                else:
                    logger.warning(f"Falló la generación del segmento {i+1}")

            if not temp_files:
                logger.error("No se generó ningún segmento de audio")
                return False, []
                
            import wave
            durations = []
            for wav in temp_files:
                with wave.open(str(wav), 'rb') as w:
                    frames = w.getnframes()
                    rate = w.getframerate()
                    durations.append(frames / float(rate))

            if len(temp_files) == 1:
                # Solo un segmento, copiar directamente
                import shutil
                output_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(temp_files[0], output_path)
                return True, durations

            # Concatenar con ffmpeg
            success = self._concat_wav_files(temp_files, output_path)
            return success, durations

        except Exception as e:
            logger.error(f"Error generando audio concatenado: {e}")
            return False, []

    def _concat_wav_files(self, wav_files: list, output_path: Path) -> bool:
        """Concatena múltiples .wav en uno solo usando ffmpeg."""
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Crear archivo de lista para ffmpeg
        list_file = self.cache_dir / "_concat_list.txt"
        with open(list_file, 'w') as f:
            for wav in wav_files:
                f.write(f"file '{wav}'\n")

        try:
            result = subprocess.run(
                [
                    "ffmpeg", "-y",
                    "-f", "concat",
                    "-safe", "0",
                    "-i", str(list_file),
                    "-c", "copy",
                    str(output_path),
                ],
                capture_output=True, timeout=120,
            )

            if result.returncode == 0 and output_path.exists():
                logger.info(f"Audio concatenado generado: {output_path.name}")
                return True
            else:
                logger.error(f"ffmpeg error: {result.stderr.decode('utf-8', errors='replace')[-500:]}")
                return False

        except FileNotFoundError:
            logger.error("ffmpeg no está instalado")
            return False
        finally:
            list_file.unlink(missing_ok=True)
