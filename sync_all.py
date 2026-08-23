#!/usr/bin/env python3
import os
import json
import re

base_dir = os.path.dirname(os.path.abspath(__file__))

content_json_path = os.path.join(base_dir, 'content.json')
content_js_path = os.path.join(base_dir, 'content.js')

content_data = {}
if os.path.exists(content_json_path):
    with open(content_json_path, 'r', encoding='utf-8') as f:
        content_data = json.load(f)

    # 1. Update content.js
    with open(content_js_path, 'w', encoding='utf-8') as f:
        f.write("// Central site content loaded across the website.\n")
        f.write("// Edit content.json to change any text easily, then run: python3 sync_all.py\n")
        f.write("window.SITE_CONTENT = " + json.dumps(content_data, indent=2, ensure_ascii=False) + ";\n")
    print("✓ content.js updated from content.json")

    # 2. Synchronize index.html
    index_html_path = os.path.join(base_dir, 'index.html')
    if os.path.exists(index_html_path):
        with open(index_html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        # Site Title
        if content_data.get('siteTitle'):
            html = re.sub(r'<title>.*?</title>', f"<title>{content_data['siteTitle']}</title>", html)

        # Intro Envelope
        intro = content_data.get('introEnvelope', {})
        if intro.get('stamp'):
            html = re.sub(r'(<div class="stamp">)[^<]*(</div>)', r'\g<1>' + intro['stamp'] + r'\g<2>', html)
        if intro.get('heartSeal'):
            html = re.sub(r'(<div class="heart-seal">)[^<]*(</div>)', r'\g<1>' + intro['heartSeal'] + r'\g<2>', html)
        if intro.get('tapInstruction'):
            html = re.sub(r'(<p class="tap-text">)[^<]*(</p>)', r'\g<1>' + intro['tapInstruction'] + r'\g<2>', html)
        if intro.get('highlight'):
            html = re.sub(r'(<p class="highlight">)[^<]*(</p>)', r'\g<1>' + intro['highlight'] + r'\g<2>', html)
        if intro.get('title') and intro.get('body'):
            letter_pattern = r'(<div class="letter">\s*)<p>.*?</p>\s*<p>.*?</p>(\s*<p class="highlight">)'
            letter_replacement = r'\g<1><p>' + intro['title'] + r'</p>\n                    <p>' + intro['body'] + r'</p>\g<2>'
            html = re.sub(letter_pattern, letter_replacement, html, flags=re.DOTALL)

        # Homepage Header
        hp = content_data.get('homepage', {})
        header = hp.get('header', {})
        if header.get('badge'):
            html = re.sub(r'(<header>\s*<span class="badge">)[^<]*(</span>)', r'\g<1>' + header['badge'] + r'\g<2>', html)
        if header.get('subtitle'):
            html = re.sub(r'(<h1 class="header-title">)[^<]*(</h1>)', r'\g<1>' + header['subtitle'] + r'\g<2>', html)
        if header.get('title'):
            html = re.sub(r'(<p class="header-subtitle">)[^<]*(</p>)', r'\g<1>' + header['title'] + r'\g<2>', html)

        # Countdown
        countdown = hp.get('countdown', {})
        if countdown.get('birthdayLabel'):
            html = re.sub(r'(<p class="countdown-date">)[^<]*(</p>)', r'\g<1>' + countdown['birthdayLabel'] + r'\g<2>', html)

        # Message Card
        if hp.get('messageCard'):
            html = re.sub(r'(<section class="message-card">\s*<span class="pin">📌</span>\s*<p>)[^<]*(</p>)', r'\g<1>' + hp['messageCard'] + r'\g<2>', html)

        # Music Player
        music = hp.get('musicPlayer', {})
        if music.get('nowPlaying'):
            html = re.sub(r'(<p class="now-playing">)[^<]*(</p>)', r'\g<1>' + music['nowPlaying'] + r'\g<2>', html)
        if music.get('songTitle'):
            html = re.sub(r'(<div class="song-info">\s*<p class="now-playing">[^<]*</p>\s*<h3>)[^<]*(</h3>)', r'\g<1>' + music['songTitle'] + r'\g<2>', html)
        if 'artist' in music:
            html = re.sub(r'(<p class="artist">)[^<]*(</p>)', r'\g<1>' + music['artist'] + r'\g<2>', html)
        if music.get('instruction'):
            html = re.sub(r'(<p class="instruction-text">)[^<]*(</p>)', r'\g<1>' + music['instruction'] + r'\g<2>', html)
        if music.get('audioSrc'):
            html = re.sub(r'(<audio id="bg-music" src=")[^"]*(")', r'\g<1>' + music['audioSrc'] + r'\g<2>', html)

        # Flip Cards
        flip_section = hp.get('flipCardsSection', {})
        if flip_section.get('title'):
            html = re.sub(r'(<section class="flip-cards-section">\s*<h2>)[^<]*(</h2>)', r'\g<1>' + flip_section['title'] + r'\g<2>', html)
        if flip_section.get('subtitle'):
            html = re.sub(r'(<section class="flip-cards-section">\s*<h2>[^<]*</h2>\s*<p class="sub-instruction">)[^<]*(</p>)', r'\g<1>' + flip_section['subtitle'] + r'\g<2>', html)
        if flip_section.get('cards') and isinstance(flip_section['cards'], list):
            card_texts = [c.get('backText', '') for c in flip_section['cards']]
            def replace_card_back(match):
                if replace_card_back.idx < len(card_texts):
                    txt = card_texts[replace_card_back.idx]
                    replace_card_back.idx += 1
                    return f'<div class="flip-card-back">\n                            <span class="pin">📌</span>\n                            <p>{txt}</p>\n                        </div>'
                return match.group(0)
            replace_card_back.idx = 0
            html = re.sub(r'<div class="flip-card-back">\s*<span class="pin">📌</span>\s*<p>.*?</p>\s*</div>', replace_card_back, html, flags=re.DOTALL)

        # Reasons Section
        reasons_sec = hp.get('reasonsSection', {})
        if reasons_sec.get('title'):
            html = re.sub(r'(<section class="reasons-section">\s*<h2>)[^<]*(</h2>)', r'\g<1>' + reasons_sec['title'] + r'\g<2>', html)
        if reasons_sec.get('initialPrompt'):
            html = re.sub(r'(<p id="reason-text">)[^<]*(</p>)', r'\g<1>' + reasons_sec['initialPrompt'] + r'\g<2>', html)
        if reasons_sec.get('buttonText'):
            html = re.sub(r'(<button id="spin-btn"[^>]*>)[^<]*(</button>)', r'\g<1>' + reasons_sec['buttonText'] + r'\g<2>', html)

        # Love Letter Section
        love_letter = hp.get('loveLetter', {})
        if love_letter.get('title'):
            html = re.sub(r'(<section class="love-letter-section">\s*<div class="parchment">\s*<h2>)[^<]*(</h2>)', r'\g<1>' + love_letter['title'] + r'\g<2>', html)
        if love_letter.get('text'):
            safe_text = love_letter['text'].replace('"', '&quot;')
            html = re.sub(r'(<p id="love-letter-text"[^>]*data-text=")[^"]*(">)', r'\g<1>' + safe_text + r'\g<2>', html)
        if love_letter.get('signature'):
            html = re.sub(r'(<span class="letter-signature">)[^<]*(</span>)', r'\g<1>' + love_letter['signature'] + r'\g<2>', html)

        # Nav Hub
        nav_hub = hp.get('navHub', {})
        if nav_hub.get('title'):
            html = re.sub(r'(<section class="nav-hub">\s*<h2>)[^<]*(</h2>)', r'\g<1>' + nav_hub['title'] + r'\g<2>', html)
        if nav_hub.get('links') and isinstance(nav_hub['links'], list):
            links = nav_hub['links']
            def replace_nav_card(match):
                if replace_nav_card.idx < len(links):
                    lnk = links[replace_nav_card.idx]
                    replace_nav_card.idx += 1
                    icon = lnk.get('icon', '✿')
                    title = lnk.get('title', '')
                    desc = lnk.get('desc', '')
                    href = lnk.get('href', '#')
                    return f'<a href="{href}" class="nav-card">\n                    <span class="nav-icon">{icon}</span>\n                    <span class="nav-title">{title}</span>\n                    <span class="nav-desc">{desc}</span>\n                </a>'
                return match.group(0)
            replace_nav_card.idx = 0
            html = re.sub(r'<a href="[^"]*" class="nav-card">\s*<span class="nav-icon">.*?</span>\s*<span class="nav-title">.*?</span>\s*<span class="nav-desc">.*?</span>\s*</a>', replace_nav_card, html, flags=re.DOTALL)

        with open(index_html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print("✓ index.html synchronized completely with content.json")

    # 3. Synchronize album.html (Treasure Hunt)
    album_html_path = os.path.join(base_dir, 'album.html')
    if os.path.exists(album_html_path) and content_data.get('treasureHunt'):
        th = content_data['treasureHunt']
        with open(album_html_path, 'r', encoding='utf-8') as f:
            a_html = f.read()

        if th.get('title'):
            a_html = re.sub(r'(<h1 class="album-title">)[^<]*(</h1>)', r'\g<1>' + th['title'] + r'\g<2>', a_html)
        if th.get('subtitle'):
            a_html = re.sub(r'(<p class="album-subtitle">)[^<]*(</p>)', r'\g<1>' + th['subtitle'] + r'\g<2>', a_html)
        if th.get('clues') and isinstance(th['clues'], list):
            clues = th['clues']
            for i, clue in enumerate(clues):
                card_num = i + 1
                pattern = rf'(<div class="treasure-card" data-card="{card_num}">[\s\S]*?<div class="treasure-card-back">[\s\S]*?<p>)[^<]*(</p>)'
                a_html = re.sub(pattern, r'\g<1>' + clue + r'\g<2>', a_html)
        if th.get('videoModalTitle'):
            a_html = re.sub(r'(<div id="video-modal"[^>]*>[\s\S]*?<h2>)[^<]*(</h2>)', r'\g<1>' + th['videoModalTitle'] + r'\g<2>', a_html)

        with open(album_html_path, 'w', encoding='utf-8') as f:
            f.write(a_html)
        print("✓ album.html synchronized with content.json")

    # 4. Synchronize cake.html
    cake_html_path = os.path.join(base_dir, 'cake.html')
    if os.path.exists(cake_html_path) and content_data.get('cakePage'):
        cp = content_data['cakePage']
        with open(cake_html_path, 'r', encoding='utf-8') as f:
            c_html = f.read()
        if cp.get('pageTitle'):
            c_html = re.sub(r'<title>.*?</title>', f"<title>{cp['pageTitle']}</title>", c_html)
        if cp.get('revealHeader'):
            c_html = re.sub(r'(<div id="cake-wish"[^>]*>[\s\S]*?<h2>)[^<]*(</h2>)', r'\g<1>' + cp['revealHeader'] + r'\g<2>', c_html)
        if cp.get('revealSubtitle'):
            c_html = re.sub(r'(<p class="wish-subtext">)[^<]*(</p>)', r'\g<1>' + cp['revealSubtitle'] + r'\g<2>', c_html)
        if cp.get('blowButtonText'):
            c_html = re.sub(r'(<button id="blow-btn"[^>]*>)[^<]*(</button>)', r'\g<1>' + cp['blowButtonText'] + r'\g<2>', c_html)

        with open(cake_html_path, 'w', encoding='utf-8') as f:
            f.write(c_html)
        print("✓ cake.html synchronized with content.json")

    # 5. Synchronize gallery.html (Memories)
    gallery_html_path = os.path.join(base_dir, 'gallery.html')
    if os.path.exists(gallery_html_path) and content_data.get('memoriesPage'):
        mp = content_data['memoriesPage']
        with open(gallery_html_path, 'r', encoding='utf-8') as f:
            g_html = f.read()
        if mp.get('title'):
            g_html = re.sub(r'(<h1 class="gallery-title">)[^<]*(</h1>)', r'\g<1>' + mp['title'] + r'\g<2>', g_html)
        if mp.get('subtitle'):
            g_html = re.sub(r'(<p class="gallery-subtitle">)[^<]*(</p>)', r'\g<1>' + mp['subtitle'] + r'\g<2>', g_html)
        with open(gallery_html_path, 'w', encoding='utf-8') as f:
            f.write(g_html)
        print("✓ gallery.html synchronized with content.json")

    # 6. Synchronize mosaic.html
    mosaic_html_path = os.path.join(base_dir, 'mosaic.html')
    if os.path.exists(mosaic_html_path) and content_data.get('mosaicPage'):
        mosp = content_data['mosaicPage']
        with open(mosaic_html_path, 'r', encoding='utf-8') as f:
            m_html = f.read()
        if mosp.get('title'):
            m_html = re.sub(r'(<h1 class="mosaic-title">)[^<]*(</h1>)', r'\g<1>' + mosp['title'] + r'\g<2>', m_html)
        if mosp.get('subtitle'):
            m_html = re.sub(r'(<p class="mosaic-subtitle">)[^<]*(</p>)', r'\g<1>' + mosp['subtitle'] + r'\g<2>', m_html)
        with open(mosaic_html_path, 'w', encoding='utf-8') as f:
            f.write(m_html)
        print("✓ mosaic.html synchronized with content.json")

# 7. Sync memories/ -> memories/memories.js & memories/memories.json
memories_dir = os.path.join(base_dir, 'memories')
valid_img_exts = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
memory_photos = []
if os.path.exists(memories_dir):
    for f in sorted(os.listdir(memories_dir)):
        if f.startswith('.'):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext in valid_img_exts:
            memory_photos.append(f)

memories_js_path = os.path.join(memories_dir, 'memories.js')
with open(memories_js_path, 'w', encoding='utf-8') as f:
    f.write("// Auto-generated list of photos in memories/ folder.\n")
    f.write("// Drop any new photos in memories/ and run python3 sync_all.py to refresh.\n")
    f.write("window.MEMORIES_PHOTOS = " + json.dumps(memory_photos, indent=2) + ";\n")

memories_json_path = os.path.join(memories_dir, 'memories.json')
with open(memories_json_path, 'w', encoding='utf-8') as f:
    json.dump(memory_photos, f, indent=2)
print(f"✓ memories.js updated ({len(memory_photos)} photos detected)")

# 8. Sync videos/ -> videos/videos.js & videos/videos.json
videos_dir = os.path.join(base_dir, 'videos')
valid_vid_exts = {'.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv'}
video_list = []
if os.path.exists(videos_dir):
    for f in sorted(os.listdir(videos_dir)):
        if f.startswith('.'):
            continue
        ext = os.path.splitext(f)[1].lower()
        if ext in valid_vid_exts:
            base_name = os.path.splitext(f)[0]
            if not re.match(r'^from\s+', base_name, re.IGNORECASE):
                caption = f"from {base_name}"
            else:
                caption = base_name
            video_list.append({
                "file": f,
                "caption": caption
            })

videos_js_path = os.path.join(videos_dir, 'videos.js')
with open(videos_js_path, 'w', encoding='utf-8') as f:
    f.write("// Auto-generated video list from videos/ folder.\n")
    f.write("// Drop any new videos in videos/ and run python3 sync_all.py to refresh.\n")
    f.write("window.TREASURE_VIDEOS = " + json.dumps(video_list, indent=2) + ";\n")

videos_json_path = os.path.join(videos_dir, 'videos.json')
with open(videos_json_path, 'w', encoding='utf-8') as f:
    json.dump(video_list, f, indent=2)
print(f"✓ videos.js updated ({len(video_list)} videos detected)")

print("\nAll website texts, memories, and videos are synchronized across all HTML, JS, and JSON files!")
