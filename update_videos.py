#!/usr/bin/env python3
import os
import json
import re

videos_dir = os.path.join(os.path.dirname(__file__), 'videos')
valid_exts = {'.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv'}

video_list = []
if os.path.exists(videos_dir):
    for f in sorted(os.listdir(videos_dir)):
        if f.startswith('.'):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext in valid_exts:
            base_name = os.path.splitext(f)[0]
            # Format caption: if not starting with "from", prepend "from "
            if not re.match(r'^from\s+', base_name, re.IGNORECASE):
                caption = f"from {base_name}"
            else:
                caption = base_name
            video_list.append({
                "file": f,
                "caption": caption
            })

# Write to videos.js
js_path = os.path.join(videos_dir, 'videos.js')
with open(js_path, 'w') as out:
    out.write("// Auto-generated video list from the 'videos' folder.\n")
    out.write("// Add/remove videos in the videos/ folder and run update_videos.py to refresh.\n")
    out.write("window.TREASURE_VIDEOS = " + json.dumps(video_list, indent=4) + ";\n")

# Write to videos.json
json_path = os.path.join(videos_dir, 'videos.json')
with open(json_path, 'w') as out:
    json.dump(video_list, out, indent=4)

print(f"Scanned {len(video_list)} videos in {videos_dir}.")
print(f"Updated {js_path} and {json_path}.")
