import cv2
import numpy as np
import re
from pathlib import Path
from thefuzz import fuzz
from core.excel_parser import read_hu_excel
from core.audio_processor import transcribe_video
from scripts.analizar_videos import analyze_frames

def extract_frames_pixel_diff(video_path, output_dir):
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        return []
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30
    
    saved_frames = []
    prev_frame_gray = None
    frame_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        if frame_count % int(fps) == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            save_it = False
            
            if prev_frame_gray is None:
                save_it = True
            else:
                diff = cv2.absdiff(gray, prev_frame_gray)
                if np.mean(diff) > 1.0:
                    save_it = True
                    
            if save_it:
                second = frame_count // int(fps)
                frame_path = output_dir / f"frame_{second:04d}.png"
                cv2.imwrite(str(frame_path), frame)
                saved_frames.append(frame_path)
                prev_frame_gray = gray
                
        frame_count += 1
        
    cap.release()
    return saved_frames

def remove_stopwords(text):
    stopwords = {"el", "la", "los", "las", "un", "una", "unos", "unas", "en", "de", "del", "a", "al", "que", "se", "no", "es", "con", "para", "o", "y", "sistema", "está", "este", "esta", "vamos", "hacer", "ver", "cada"}
    words = re.findall(r'\b\w+\b', text.lower())
    filtered = [w for w in words if w not in stopwords]
    return " ".join(filtered)

def main():
    video_path = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable/videos/casos-negativos/crear-registro-presenta-ncs.mp4")
    hu_dir = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable")
    tmp_dir = hu_dir / "tmp_frames_pixel_diff"
    tmp_dir.mkdir(exist_ok=True)
    
    print("Extrayendo frames con pixel diff...")
    frames = extract_frames_pixel_diff(video_path, tmp_dir)
    print(f"Frames extraídos: {len(frames)}")
    
    print("Ejecutando OCR...")
    ocr_results = analyze_frames(frames)
    
    print("Transcribiendo audio...")
    _, segments = transcribe_video(video_path)
    
    df = read_hu_excel(hu_dir)
    target_cps = ["CP_004", "CP_005", "CP_007"]
    
    print("\nResultados para CP_004, CP_005, CP_007:")
    for cp, row in df.iterrows():
        cp_id = str(row.get("Id Caso de prueba", "")).strip()
        if cp_id not in target_cps:
            continue
            
        res = str(row.get("Resultado esperado", ""))
        name = str(row.get("Nombre del caso de prueba", ""))
        name_clean = remove_stopwords(name)
        res_clean = remove_stopwords(res)
        
        max_score = 0
        best_source = None
        
        # 1. Match en OCR
        for sec, text in ocr_results.items():
            text_clean = remove_stopwords(text)
            score = max(fuzz.token_set_ratio(name_clean, text_clean), fuzz.token_set_ratio(res_clean, text_clean))
            if score > max_score:
                max_score = score
                best_source = f"OCR Frame sec {sec}"
                
        # 2. Match en Audio
        for seg in segments:
            text_clean = remove_stopwords(seg['text'])
            score = max(fuzz.token_set_ratio(name_clean, text_clean), fuzz.token_set_ratio(res_clean, text_clean))
            if score > max_score:
                max_score = score
                best_source = f"Audio [{seg['start']}-{seg['end']}]"
                
        print(f"[{cp_id}] Max Score: {max_score} | Best Source: {best_source}")
        print(f"   Name Cleaned: {name_clean}")

if __name__ == "__main__":
    import warnings
    warnings.filterwarnings("ignore")
    main()
