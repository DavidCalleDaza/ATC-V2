import json
from pathlib import Path
import cv2

def main():
    with open("config/trazabilidad.json", "r") as f:
        trazabilidad = json.load(f)
        
    base_dir = Path("user_stories")
    hus_to_check = ["HU-6680", "HU-6682", "HU-6686", "HU-6687", "HU-6688", "HU-6689"]
    
    print(f"{'HU':<10} | {'Max Trace (s)':<15} | {'Videos (Duration s)':<40} | {'Valid?':<10}")
    print("-" * 80)
    
    valid_hus = []
    
    for hu in hus_to_check:
        # Get max trace time
        max_trace = 0
        if hu in trazabilidad:
            for cp, rango in trazabilidad[hu].items():
                if rango[1] > max_trace:
                    max_trace = rango[1]
        
        # Find directory across all sprint folders
        hu_dirs = list(base_dir.rglob(f"*{hu}*"))
        # filter to just directories
        hu_dirs = [d for d in hu_dirs if d.is_dir() and "videos" not in d.name]
        
        if not hu_dirs:
            print(f"{hu:<10} | {max_trace:<15} | {'No directory found':<40} | {'NO':<10}")
            continue
            
        hu_dir = hu_dirs[0]
        videos = list(hu_dir.rglob("*.mp4"))
        
        video_durations = []
        total_duration = 0
        for v in videos:
            cap = cv2.VideoCapture(str(v))
            if cap.isOpened():
                fps = cap.get(cv2.CAP_PROP_FPS)
                frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
                duration = int(frame_count / fps) if fps > 0 else 0
                video_durations.append(f"{v.name} ({duration}s)")
                total_duration += duration
            cap.release()
            
        valid = "NO"
        # We consider it valid if total duration is >= max trace
        # And even better if it's a single video, but we can accept multiple if they sum up.
        if len(videos) == 1 and total_duration >= max_trace:
            valid = "YES"
            valid_hus.append(hu)
        elif len(videos) > 1 and total_duration >= max_trace:
            valid = "WARNING (Multi-video)"
            
        videos_str = ", ".join(video_durations)
        if len(videos_str) > 40:
            videos_str = videos_str[:37] + "..."
            
        print(f"{hu:<10} | {max_trace:<15} | {videos_str:<40} | {valid:<10}")
        
    print("\nValid HUs found:", valid_hus)

if __name__ == "__main__":
    main()
