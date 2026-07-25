import json
from pathlib import Path
from thefuzz import fuzz
from core.excel_parser import read_hu_excel
from core.audio_processor import transcribe_video
from scripts.analizar_videos import analyze_frames
from sentence_transformers import SentenceTransformer, util
import warnings
warnings.filterwarnings("ignore")
import cv2
import numpy as np
import re

# Model setup
print("Cargando modelo MiniLM multilingual...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

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

def get_best_match(name, res, ocr_results, segments, use_semantic=False):
    best_sec = -1
    best_score = -1.0
    
    name_clean = remove_stopwords(name)
    res_clean = remove_stopwords(res)
    
    if use_semantic:
        cp_emb = model.encode(name + " " + res, convert_to_tensor=True)
    
    # Check OCR
    for sec, text in ocr_results.items():
        if not str(text).strip(): continue
        if use_semantic:
            text_emb = model.encode(text, convert_to_tensor=True)
            score = util.cos_sim(cp_emb, text_emb).item() * 100
        else:
            t_clean = remove_stopwords(text)
            score = max(fuzz.token_set_ratio(name_clean, t_clean), fuzz.token_set_ratio(res_clean, t_clean))
        if score > best_score:
            best_score = score
            best_sec = sec
            
    # Check Audio
    for seg in segments:
        if not str(seg['text']).strip(): continue
        sec = int((seg['start'] + seg['end']) / 2)
        if use_semantic:
            text_emb = model.encode(seg['text'], convert_to_tensor=True)
            score = util.cos_sim(cp_emb, text_emb).item() * 100
        else:
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
    print(f"Procesando video: {video_path.name}")
    
    tmp_dir = hu_dir / "tmp_semantic"
    tmp_dir.mkdir(exist_ok=True)
    
    frames = extract_frames_pixel_diff(video_path, tmp_dir)
    ocr_results = analyze_frames(frames)
    _, segments = transcribe_video(video_path)
    
    df = read_hu_excel(hu_dir)
    
    print("\n| CP_ID | Rango Trazabilidad | Score Fuzzy | ¿Acierta Fuzzy? | Score Semántico | ¿Acierta Semántico? |")
    print("|---|---|---|---|---|---|")
    
    trace_data = trazabilidad.get(hu_name, {})
    
    for cp, row in df.iterrows():
        cp_id = str(row.get("Id Caso de prueba", "")).strip()
        if cp_id not in trace_data: continue
        
        rango = trace_data[cp_id]
        name = str(row.get("Nombre del caso de prueba", ""))
        res = str(row.get("Resultado esperado", ""))
        
        fuzzy_sec, fuzzy_score = get_best_match(name, res, ocr_results, segments, use_semantic=False)
        sem_sec, sem_score = get_best_match(name, res, ocr_results, segments, use_semantic=True)
        
        fuzzy_correct = "SÍ" if (rango[0] <= fuzzy_sec <= rango[1]) else "NO"
        sem_correct = "SÍ" if (rango[0] <= sem_sec <= rango[1]) else "NO"
        
        print(f"| {cp_id} | [{rango[0]}, {rango[1]}] | {fuzzy_score:.1f} (s{fuzzy_sec}) | {fuzzy_correct} | {sem_score:.1f} (s{sem_sec}) | {sem_correct} |")

if __name__ == "__main__":
    main()
