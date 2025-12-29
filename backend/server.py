from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
from starlette.middleware.cors import CORSMiddleware
import urllib.parse
import random

# Load .env (untuk lokal, di HF nanti pakai Secrets)
load_dotenv()

# Konfigurasi Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY belum diset!")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI()

# Konfigurasi CORS (Agar Frontend bisa akses Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mengizinkan semua akses (aman untuk publik API sederhana)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model Data Input
class BuildRequest(BaseModel):
    idea: str
    style: str = "medieval"
    biome: str = "plains"
    scale: str = "medium"

def generate_gemini_concept(data: BuildRequest):
    """
    Fungsi ini meminta Gemini membuatkan konsep JSON dan prompt gambar.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Prompt untuk Gemini
    prompt = f"""
    Act as a professional Minecraft Architect. Create a detailed build concept for:
    Idea: {data.idea}
    Style: {data.style}
    Biome: {data.biome}
    Scale: {data.scale}

    You MUST return ONLY valid JSON (no markdown formatting like ```json).
    The JSON structure must be exactly like this:
    {{
        "title": "A Creative Title",
        "difficulty": "Beginner/Intermediate/Advanced",
        "estimatedTime": "e.g. 2-3 hours",
        "palette": {{
            "main": ["Block Name 1", "Block Name 2"],
            "accent": ["Block Name 3"],
            "detail": ["Block Name 4"],
            "lighting": ["Light Block 1"]
        }},
        "layers": ["Step 1: Description", "Step 2: Description", "Step 3: Description"],
        "tips": ["Pro tip 1", "Pro tip 2"],
        "features": ["Feature 1", "Feature 2"],
        "image_prompt": "A cinematic shot of minecraft {data.style} {data.idea} in {data.biome}, rtx on, 8k, photorealistic textures, dramatic lighting"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Bersihkan response dari format markdown jika ada
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        # Fallback data jika Gemini gagal/limit
        return {
            "title": f"{data.style} {data.idea}",
            "difficulty": "Intermediate",
            "estimatedTime": "Unknown",
            "palette": {"main": ["Oak Planks"], "accent": ["Cobblestone"], "detail": ["Glass"], "lighting": ["Torch"]},
            "layers": ["Foundation", "Walls", "Roof"],
            "tips": ["Try mixing blocks for texture."],
            "features": ["Main structure"],
            "image_prompt": f"Minecraft {data.style} {data.idea} in {data.biome} biome"
        }

def generate_safe_image_url(prompt):
    """
    Fungsi ini membuat URL Pollinations yang AMAN dan VALID.
    Masalah gambar tidak muncul biasanya karena URL mengandung spasi/karakter aneh.
    """
    # 1. Tambahkan seed acak agar gambar selalu berubah
    seed = random.randint(1, 999999)
    
    # 2. Encode prompt (ganti spasi jadi %20, dll) -> KUNCI AGAR GAMBAR MUNCUL
    encoded_prompt = urllib.parse.quote(prompt)
    
    # 3. Gunakan model 'flux' atau 'turbo' untuk hasil bagus & cepat
    # Ukuran 1024x576 (16:9) cocok untuk cinematic view
    return f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){encoded_prompt}?width=1024&height=576&nologo=true&seed={seed}&model=flux"

@app.post("/api/generate")
async def generate_build(request: BuildRequest):
    # Tahap 1: Pakai Gemini untuk mikir konsep & bikin prompt gambar
    concept_data = generate_gemini_concept(request)
    
    # Tahap 2: Pakai prompt dari Gemini untuk generate URL gambar
    # Mengambil 'image_prompt' dari hasil Gemini, atau pakai ide user kalau error
    prompt_for_image = concept_data.get("image_prompt", f"{request.style} {request.idea} minecraft build")
    
    # Generate 4 URL variasi (bisa dikembangkan biar beda-beda promptnya)
    image_url_cinematic = generate_safe_image_url(prompt_for_image + ", cinematic view, detailed lighting, 8k render, photorealistic, voxel art, Camera angle: eye level serene, Epic composition")
    image_url_palette = generate_safe_image_url(prompt_for_image + ", flat lay block palette style, 8k, organized grid, white background, material breakdown, clean inventory view")
    image_url_angle = generate_safe_image_url(prompt_for_image + ", Isometric technical drawing, 8k, schematic style, white background, 3d render, legends detail, clear building details")
    image_url_blueprint = generate_safe_image_url(prompt_for_image + ", blueprint schematic style, 8k, blue background, technical drawing, white lines, top down view")
    
    # Tahap 3: Gabungkan data untuk dikirim ke Frontend
    return {
        **concept_data,
        "images": {
            "cinematic": image_url_cinematic,
            "palette": image_url_palette,
            "angle": image_url_angle,
            "blueprint": image_url_blueprint
        }
    }

@app.get("/")
def read_root():
    return {"status": "Active", "engine": "Gemini + Hugging Face"}
