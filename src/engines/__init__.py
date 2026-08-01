"""
Processing engines — local (offline) and cloud (API-based).

Selección de backend vía variable de entorno ATC_BACKEND:
  local  = 100% offline (default)
  cloud  = requiere GEMINI_API_KEY

Uso:
  from src.engines.registry import get_narration_engine
  engine = get_narration_engine()
  texto = engine.generate(tc, index)
"""
