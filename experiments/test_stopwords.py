import re
from thefuzz import fuzz
from core.excel_parser import read_hu_excel
from pathlib import Path

def remove_stopwords(text):
    stopwords = {"el", "la", "los", "las", "un", "una", "unos", "unas", "en", "de", "del", "a", "al", "que", "se", "no", "es", "con", "para", "o", "y", "sistema", "está", "este", "esta"}
    words = re.findall(r'\b\w+\b', text.lower())
    filtered = [w for w in words if w not in stopwords]
    return " ".join(filtered)

audio_text = "actualmente el sistema no está funcionando, está alerrado en la parte superior derecha con un error de JSON que no es uno legible para el lector o el usuario en línea"
audio_clean = remove_stopwords(audio_text)

hu_dir = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable")
df = read_hu_excel(hu_dir)

print(f"Texto audio original: {audio_text}")
print(f"Texto audio limpio: {audio_clean}")
print("-" * 50)

for cp, row in df.iterrows():
    cp_id = str(row.get("Id Caso de prueba", "")).strip()
    if cp_id:
        res = str(row.get("Resultado esperado", ""))
        name = str(row.get("Nombre del caso de prueba", ""))
        
        # Original scores
        score_orig = max(fuzz.token_set_ratio(name, audio_text), fuzz.token_set_ratio(res, audio_text))
        
        # Cleaned scores
        name_clean = remove_stopwords(name)
        res_clean = remove_stopwords(res)
        score_clean = max(fuzz.token_set_ratio(name_clean, audio_clean), fuzz.token_set_ratio(res_clean, audio_clean))
        
        print(f"[{cp_id}] Score Orig: {score_orig} | Score Clean: {score_clean} | ({name_clean})")
