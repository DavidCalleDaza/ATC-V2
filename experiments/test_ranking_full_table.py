import json
import pickle
from pathlib import Path
from thefuzz import fuzz
import re

from core.excel_parser import read_hu_excel

def remove_stopwords(text):
    stopwords = {"el", "la", "los", "las", "un", "una", "en", "de", "del", "a", "al", "que", "se", "no", "es", "con", "para", "o", "y", "sistema"}
    words = re.findall(r'\b\w+\b', text.lower())
    return " ".join([w for w in words if w not in stopwords])

def get_ranked_candidates(target_texts, ocr_results, segments):
    candidates = []
    cleaned_targets = [remove_stopwords(t) for t in target_texts if t.strip()]
    
    # Check OCR
    for sec, text in ocr_results.items():
        if not str(text).strip(): continue
        t_clean = remove_stopwords(text)
        score = max([fuzz.token_set_ratio(t, t_clean) for t in cleaned_targets]) if cleaned_targets else 0
        candidates.append({"sec": int(sec), "score": score, "source": "OCR"})
            
    # Check Audio
    for seg in segments:
        sec = int((seg['start'] + seg['end']) / 2)
        if not str(seg['text']).strip(): continue
        t_clean = remove_stopwords(seg['text'])
        score = max([fuzz.token_set_ratio(t, t_clean) for t in cleaned_targets]) if cleaned_targets else 0
        candidates.append({"sec": sec, "score": score, "source": "Audio"})
            
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates

def main():
    with open("config/trazabilidad.json", "r") as f:
        trazabilidad = json.load(f)
        
    base_dir = Path("user_stories/sprint-02")
    hu_name = "HU-6682"
    hu_dir = list(base_dir.glob("*6682*"))[0]
    
    cache_file = hu_dir / "cache_data.pkl"
    with open(cache_file, "rb") as f:
        data = pickle.load(f)
        ocr_results = data["ocr"]
        segments = data["segments"]

    df = read_hu_excel(hu_dir)
    trace_data = trazabilidad.get(hu_name, {})
    
    print("| CP_ID | Rango | Mejor Score Absoluto | Score del Acierto | Posición del Acierto | Total Candidatos |")
    print("|---|---|---|---|---|---|")
    
    for cp, row in df.iterrows():
        cp_id = str(row.get("Id Caso de prueba", "")).strip()
        if cp_id not in trace_data: continue
        
        rango = trace_data[cp_id]
        name = str(row.get("Nombre del caso de prueba", ""))
        pasos = str(row.get("Pasos", ""))
        
        target_texts = [pasos + " " + name]
        candidates = get_ranked_candidates(target_texts, ocr_results, segments)
        
        correct_rank = -1
        correct_score = -1
        best_overall = candidates[0]["score"] if candidates else 0
        
        for i, cand in enumerate(candidates):
            if rango[0] <= cand["sec"] <= rango[1]:
                correct_rank = i + 1
                correct_score = cand["score"]
                break
                
        rank_str = str(correct_rank) if correct_rank != -1 else "No encontrado"
        score_str = str(correct_score) if correct_score != -1 else "N/A"
        
        print(f"| {cp_id} | [{rango[0]}, {rango[1]}] | {best_overall:.1f} | {score_str} | {rank_str} | {len(candidates)} |")

if __name__ == "__main__":
    main()
