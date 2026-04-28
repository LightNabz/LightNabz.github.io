import os
import time
from curl_cffi import requests

# --- CONFIGURATION ---
OUTPUT = "assets/images"
os.makedirs(OUTPUT, exist_ok=True)

# Ensure no spaces in these strings
USERNAME = "jeffreyblockstein"
API_KEY = "3wbqbYKTVHzDWZAaPNpKbEsZ" 

WAIFUS = {
    "furina_(genshin_impact)":      "furina.jpg",
    "alice_zuberg":                "alice.jpg",    
    "misaka_mikoto":               "mikoto.jpg",
    "amagami_asahi":               "asahi.jpg",
    "ichigaya_arisa":              "arisa.jpg",
    "index_(toaru_majutsu_no_index)": "index.jpg",
    "gotou_hitori":                "bocchi.jpg",
    "kobo_kanaeru":                "kobo.jpg",
    "hoshino_ruby":                "ruby.jpg",
    "rem_(re:zero)":               "rem.jpg",
    "kubo_nagisa":                 "kubo.jpg",
    "tokisaki_kurumi":             "kurumi.jpg",
    "honda_mio":                   "mio.jpg",
    "rimuru_tempest":              "rimuru.jpg",
    "izawa_shizue":                "shizue.jpg",   
    "topaz_(honkai:_star_rail)":    "topaz.jpg",
    "miyamizu_yotsuha":            "yotsuha.jpg",
    "gokou_ruri":                  "ruri.jpg",
    "milize_vladilena":            "vladilena.jpg",
    "siesta_(tanmoshi)":           "siesta.jpg",
}

BASE = "https://danbooru.donmai.us/posts.json"

HEADERS = {
    "Accept": "application/json",
    "Referer": "https://danbooru.donmai.us/",
}

def fetch_one(tag, filename):
    # Only 2 tags to avoid 422 Error (Tag Limit)
    query = f"{tag} rating:general"
    
    params = {
        "tags": query,
        "limit": 10, # Fetch 10 so we can pick a good one manually
        "random": "true",
    }
    
    auth = (USERNAME, API_KEY)
    
    r = requests.get(BASE, params=params, headers=HEADERS, auth=auth, impersonate="chrome120", timeout=15)
    
    if r.status_code == 422:
        print(f"  [!] 422 Error: Tag limit or invalid tag for {tag}. Trying with only character tag.")
        params["tags"] = tag
        r = requests.get(BASE, params=params, headers=HEADERS, auth=auth, impersonate="chrome120", timeout=15)

    r.raise_for_status()
    posts = r.json()

    if not posts:
        print(f"  [✗] No images found for: {tag}")
        return

    # LOGIC: Find the first image in the 10 results that is a solo image and NOT a video
    selected_post = None
    for post in posts:
        url = post.get("large_file_url") or post.get("file_url")
        if not url: continue
        
        # 1. Skip videos/zips
        if any(ext in url.lower() for ext in [".mp4", ".webm", ".zip", ".swf"]):
            continue
            
        # 2. Check for "solo" in the tags list (Danbooru returns tags as a space-separated string)
        post_tags = post.get("tag_string", "").split()
        if "solo" in post_tags:
            selected_post = post
            break # Found our perfect image
    
    # Fallback: if no 'solo' image in top 10, just take the first non-video image
    if not selected_post:
        for post in posts:
            url = post.get("large_file_url") or post.get("file_url")
            if url and not any(ext in url.lower() for ext in [".mp4", ".webm", ".zip"]):
                selected_post = post
                break

    if not selected_post:
        print(f"  [!] All 10 results for {tag} were videos or invalid.")
        return

    # Final Download
    final_url = selected_post.get("large_file_url") or selected_post.get("file_url")
    ext = final_url.split(".")[-1].split("?")[0]
    dest = os.path.join(OUTPUT, f"{filename.rsplit('.', 1)[0]}.{ext}")

    img = requests.get(final_url, headers=HEADERS, impersonate="chrome120", timeout=30)
    img.raise_for_status()
    
    with open(dest, "wb") as f:
        f.write(img.content)
    print(f"  [✓] {tag} saved as {dest}")

# --- EXECUTION ---
print("Starting download process...\n")
for tag, fname in WAIFUS.items():
    print(f"Processing: {tag}")
    try:
        fetch_one(tag, fname)
    except Exception as e:
        print(f"  [✗] Error: {e}")
    time.sleep(1.5)

print("\nDone!")
