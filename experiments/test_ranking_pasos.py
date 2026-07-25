import json
import pickle
from pathlib import Path
from thefuzz import fuzz
import re
import numpy as np

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
            
    # Sort candidates by score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates

def run_experiment(df, trace_data, ocr_results, segments, mode="pasos"):
    ranks = []
    
    for cp, row in df.iterrows():
        cp_id = str(row.get("Id Caso de prueba", "")).strip()
        if cp_id not in trace_data: continue
        
        rango = trace_data[cp_id]
        name = str(row.get("Nombre del caso de prueba", ""))
        res = str(row.get("Resultado esperado", ""))
        pasos = str(row.get("Pasos", ""))
        
        if mode == "pasos":
            target_texts = [pasos]
        elif mode == "pasos+nombre":
            target_texts = [pasos, name]
        elif mode == "concat":
            target_texts = [pasos + " " + name]
        
        candidates = get_ranked_candidates(target_texts, ocr_results, segments)
        
        correct_rank = -1
        
        for i, cand in enumerate(candidates):
            if rango[0] <= cand["sec"] <= rango[1]:
                correct_rank = i + 1
                break
                
        ranks.append(correct_rank)
        
    valid_ranks = [r for r in ranks if r != -1]
    if not valid_ranks: return 999.9, 0, 0, 0
    
    avg_rank = sum(valid_ranks) / len(valid_ranks)
    top3 = len([r for r in valid_ranks if r <= 3])
    top5 = len([r for r in valid_ranks if r <= 5])
    top10 = len([r for r in valid_ranks if r <= 10])
    
    return avg_rank, top3, top5, top10

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
    
    print("\n--- BASELINE (Resultado Esperado + Nombre) ---")
    print("Promedio de ranking: 68.2 | Top-10: 3 / 19")
    
    print("\n--- VARIANTE 1: Solo 'Pasos' ---")
    avg, top3, top5, top10 = run_experiment(df, trace_data, ocr_results, segments, mode="pasos")
    print(f"Promedio de ranking: {avg:.1f}")
    print(f"Top 3: {top3} / 19")
    print(f"Top 5: {top5} / 19")
    print(f"Top 10: {top10} / 19")
    
    print("\n--- VARIANTE 2: 'Pasos' O 'Nombre' (max score) ---")
    avg, top3, top5, top10 = run_experiment(df, trace_data, ocr_results, segments, mode="pasos+nombre")
    print(f"Promedio de ranking: {avg:.1f}")
    print(f"Top 3: {top3} / 19")
    print(f"Top 5: {top5} / 19")
    print(f"Top 10: {top10} / 19")
    
    print("\n--- VARIANTE 3: 'Pasos' + 'Nombre' (concatenados) ---")
    avg, top3, top5, top10 = run_experiment(df, trace_data, ocr_results, segments, mode="concat")
    print(f"Promedio de ranking: {avg:.1f}")
    print(f"Top 3: {top3} / 19")
    print(f"Top 5: {top5} / 19")
    print(f"Top 10: {top10} / 19")

if __name__ == "__main__":
    main()
