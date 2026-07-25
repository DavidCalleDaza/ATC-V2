import json
import pickle
from pathlib import Path
from thefuzz import fuzz
import cv2
import numpy as np
import re
import os

from core.excel_parser import read_hu_excel
from core.audio_processor import transcribe_video
from scripts.analizar_videos import analyze_frames

def extract_frames_pixel_diff(video_path, output_dir):
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened(): return []
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30
    saved_frames = []
    prev_gray = None
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        if count % int(fps) == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if prev_gray is None or np.mean(cv2.absdiff(gray, prev_gray)) > 1.0:
                sec = count // int(fps)
                path = output_dir / f"frame_{sec:04d}.png"
                cv2.imwrite(str(path), frame)
                saved_frames.append(path)
                prev_gray = gray
        count += 1
    cap.release()
    return saved_frames

def remove_stopwords(text):
    stopwords = {"el", "la", "los", "las", "un", "una", "en", "de", "del", "a", "al", "que", "se", "no", "es", "con", "para", "o", "y", "sistema"}
    words = re.findall(r'\b\w+\b', text.lower())
    return " ".join([w for w in words if w not in stopwords])

def get_best_match_monotonic(name, res, ocr_results, segments, min_time):
    best_sec = -1
    best_score = -1.0
    
    name_clean = remove_stopwords(name)
    res_clean = remove_stopwords(res)
    
    # Check OCR
    for sec, text in ocr_results.items():
        if int(sec) < min_time: continue
        if not str(text).strip(): continue
        t_clean = remove_stopwords(text)
        score = max(fuzz.token_set_ratio(name_clean, t_clean), fuzz.token_set_ratio(res_clean, t_clean))
        if score > best_score:
            best_score = score
            best_sec = int(sec)
            
    # Check Audio
    for seg in segments:
        sec = int((seg['start'] + seg['end']) / 2)
        if sec < min_time: continue
        if not str(seg['text']).strip(): continue
        t_clean = remove_stopwords(seg['text'])
        score = max(fuzz.token_set_ratio(name_clean, t_clean), fuzz.token_set_ratio(res_clean, t_clean))
        if score > best_score:
            best_score = score
            best_sec = sec
            
    return best_sec, best_score

def main():
    with open("config/trazabilidad.json", "r") as f:
        trazabilidad = json.load(f)
        
    base_dir = Path("user_stories/sprint-02")
    hu_name = "HU-6682"
    hu_dir = list(base_dir.glob("*6682*"))[0]
    video_path = list(hu_dir.rglob("*.mp4"))[0]
    
    cache_file = hu_dir / "cache_data.pkl"
    if cache_file.exists():
        print("Cargando datos cacheados (OCR + Whisper)...")
        with open(cache_file, "rb") as f:
            data = pickle.load(f)
            ocr_results = data["ocr"]
            segments = data["segments"]
    else:
        print("Calculando OCR y Whisper desde cero...")
        tmp_dir = hu_dir / "tmp_semantic"
        tmp_dir.mkdir(exist_ok=True)
        frames = extract_frames_pixel_diff(video_path, tmp_dir)
        ocr_results = analyze_frames(frames)
        _, segments = transcribe_video(video_path)
        with open(cache_file, "wb") as f:
            pickle.dump({"ocr": ocr_results, "segments": segments}, f)

    df = read_hu_excel(hu_dir)
    
    print("\n| CP_ID | Rango Trazabilidad | Score Fuzzy (Monotónico) | ¿Acierta? |")
    print("|---|---|---|---|")
    
    trace_data = trazabilidad.get(hu_name, {})
    
    current_time = 0
    correct_count = 0
    total_count = 0
    
    for cp, row in df.iterrows():
        cp_id = str(row.get("Id Caso de prueba", "")).strip()
        if cp_id not in trace_data: continue
        
        rango = trace_data[cp_id]
        name = str(row.get("Nombre del caso de prueba", ""))
        res = str(row.get("Resultado esperado", ""))
        
        best_sec, best_score = get_best_match_monotonic(name, res, ocr_results, segments, min_time=current_time)
        
        is_correct = "SÍ" if (rango[0] <= best_sec <= rango[1]) else "NO"
        if is_correct == "SÍ":
            correct_count += 1
        total_count += 1
            
        print(f"| {cp_id} | [{rango[0]}, {rango[1]}] | {best_score:.1f} (s{best_sec}) | {is_correct} |")
        
        # Advance the monotonic time to the found second, or keep it if not found.
        if best_sec >= current_time:
            current_time = best_sec

    print(f"\nResumen: {correct_count} aciertos de {total_count} ({correct_count/total_count*100:.1f}%)")

if __name__ == "__main__":
    main()
