import re
from thefuzz import fuzz
from core.excel_parser import read_hu_excel
from core.audio_processor import transcribe_video
from pathlib import Path
import warnings
warnings.filterwarnings("ignore")

def remove_stopwords(text):
    stopwords = {"el", "la", "los", "las", "un", "una", "unos", "unas", "en", "de", "del", "a", "al", "que", "se", "no", "es", "con", "para", "o", "y", "sistema", "está", "este", "esta", "vamos", "hacer", "ver", "cada"}
    words = re.findall(r'\b\w+\b', text.lower())
    filtered = [w for w in words if w not in stopwords]
    return " ".join(filtered)

video_path = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable/videos/casos-negativos/crear-registro-presenta-ncs.mp4")
hu_dir = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable")
df = read_hu_excel(hu_dir)

_, segments = transcribe_video(video_path)

print("Resultados máximos por CP (Original vs Cleaned):")
for cp, row in df.iterrows():
    cp_id = str(row.get("Id Caso de prueba", "")).strip()
    if not cp_id: continue
        
    res = str(row.get("Resultado esperado", ""))
    name = str(row.get("Nombre del caso de prueba", ""))
    name_clean = remove_stopwords(name)
    res_clean = remove_stopwords(res)
    
    max_orig = 0
    max_clean = 0
    
    for seg in segments:
        audio_text = seg['text']
        audio_clean = remove_stopwords(audio_text)
        
        score_orig = max(fuzz.token_set_ratio(name, audio_text), fuzz.token_set_ratio(res, audio_text))
        score_clean = max(fuzz.token_set_ratio(name_clean, audio_clean), fuzz.token_set_ratio(res_clean, audio_clean))
        
        if score_orig > max_orig: max_orig = score_orig
        if score_clean > max_clean: max_clean = score_clean
        
    print(f"[{cp_id}] Max Orig: {max_orig} | Max Clean: {max_clean}")
