from pathlib import Path
import cv2
from PIL import Image
import imagehash
import os

def test_dedup_on_video(video_path):
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        return 0, 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30
    
    total_frames_extracted = 0
    unique_frames = 0
    prev_hash = None
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        # 1 FPS extraction
        if frame_count % int(fps) == 0:
            total_frames_extracted += 1
            
            # Simulate the current logic
            img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(img_rgb)
            current_hash = imagehash.average_hash(pil_img)
            
            # The current logic is < 1, but wait! The user wants me to test what we had.
            # Originally it was < 3, and I changed it to < 1. I'll test both.
            if prev_hash is None or current_hash - prev_hash >= 1: # current logic
                unique_frames += 1
                prev_hash = current_hash
                
        frame_count += 1
    
    cap.release()
    return total_frames_extracted, unique_frames

def main():
    sprint_dir = Path("user_stories/sprint-02")
    
    for hu_dir in sprint_dir.iterdir():
        if not hu_dir.is_dir() or not (hu_dir.name.startswith("CP_HU-668") or hu_dir.name.startswith("HU-668")):
            continue
            
        videos = list(hu_dir.rglob("*.mp4"))
        for v in videos:
            total, unique = test_dedup_on_video(v)
            print(f"[{hu_dir.name}] {v.name}: {total} frames extraídos -> {unique} frames únicos (threshold < 1)")

if __name__ == "__main__":
    main()
