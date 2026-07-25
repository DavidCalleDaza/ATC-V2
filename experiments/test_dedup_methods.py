import cv2
import numpy as np
from pathlib import Path

def test_dedup_methods(video_path):
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        return
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30
    
    total_frames = 0
    unique_pixel_diff = 0
    
    prev_frame_gray_pixel = None
    
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret: break
        
        if frame_count % int(fps) == 0:
            total_frames += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Method 1: Pixel Difference (Mean Absolute Difference)
            if prev_frame_gray_pixel is None:
                unique_pixel_diff += 1
                prev_frame_gray_pixel = gray
            else:
                diff = cv2.absdiff(gray, prev_frame_gray_pixel)
                mean_diff = np.mean(diff)
                if mean_diff > 1.0:  # threshold calibrated for UI changes
                    unique_pixel_diff += 1
                    prev_frame_gray_pixel = gray
                    
        frame_count += 1
        
    cap.release()
    print(f"Video: {video_path.name}")
    print(f"  Total Extracted: {total_frames}")
    print(f"  Unique (Pixel Diff > 1.0): {unique_pixel_diff}")

if __name__ == "__main__":
    v = Path("user_stories/sprint-02/CP_HU-6699 Crear Activo Expirable/videos/casos-negativos/crear-registro-presenta-ncs.mp4")
    test_dedup_methods(v)
