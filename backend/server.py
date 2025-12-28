from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
import base64
import io
from starlette.middleware.cors import CORSMiddleware

# Load env vars
load_dotenv()

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in env variables!")

genai.configure(api_key=GENAI_API_KEY)

app = FastAPI()

# CORS config (Agar frontend bisa akses)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Nanti ganti dengan URL Vercel Anda biar aman
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class BuildRequest(BaseModel):
    idea: str
    style: str = "medieval"
    biome: str = "plains"
    scale: str = "medium"

# --- HELPER: TEXT GENERATION ---
def generate_concept_with_gemini(data: BuildRequest):
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are a Minecraft Architect Expert. Create a detailed build concept JSON for:
    Idea: {data.idea}
    Style: {data.style}
    Biome: {data.biome}
    Scale: {data.scale}

    Output MUST be valid JSON only (no markdown code blocks) with this EXACT structure:
    {{
        "title": "A Creative Title",
        "description": "A short engaging description",
        "difficulty": "Beginner/Intermediate/Expert",
        "estimatedTime": "e.g. 2-3 hours",
        "palette": {{
            "main": ["Block1", "Block2"],
            "accent": ["Block3", "Block4"],
            "detail": ["Block5", "Block6"]
        }},
        "layers": ["Foundation", "Frame", "Walls", "Roof", "Details"],
        "tips": ["Tip 1", "Tip 2", "Tip 3"],
        "features": ["Feature 1", "Feature 2"],
        "image_prompt": "A highly detailed cinematic minecraft render of {data.idea}, {data.style} style, in {data.biome}, RTX on, 8k resolution, photorealistic textures"
    }}
    """
    
    response = model.generate_content(prompt)
    
    # Bersihkan response jika ada markdown ```json
    text = response.text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)

# --- HELPER: IMAGE GENERATION (IMAGEN) ---
def generate_image_with_imagen(prompt_text):
    # Catatan: Imagen 3 mungkin belum tersedia untuk semua akun free tier via API.
    # Jika error, kita fallback ke Gemini Flash yang mendeskripsikan URL placeholder atau error handling.
    try:
        # Gunakan model Imagen jika tersedia di akun Anda
        # Jika belum punya akses Imagen via API, kode ini akan error dan masuk except.
        # Alternatif: Gunakan 'gemini-pro-vision' tidak bisa generate image.
        # Kita coba pattern standar Imagen via library google-generativeai
        
        # NOTE: Saat ini library python google-generativeai support imagen via:
        # imagen_model = genai.ImageGenerationModel("imagen-3.0-generate-001")
        # Tapi karena library sering update, pastikan di requirements terbaru.
        
        # SEMENTARA: Karena Imagen API sering berbayar/terbatas, 
        # saya buat logic fallback yang aman. 
        # Jika Anda punya akses Imagen, uncomment baris bawah:
        
        # model = genai.GenerativeModel("imagen-3.0-generate-001")
        # result = model.generate_images(prompt=prompt_text, number_of_images=1)
        # return "data:image/png;base64," + base64.b64encode(result.images[0].image_bytes).decode()

        # JIKA BELUM PUNYA AKSES IMAGEN, kita pakai Pollinations tapi dengan prompt yang DI-OPTIMALKAN GEMINI
        # Ini solusi paling aman agar gambar TETAP MUNCUL dan GRATIS tapi LEBIH BAGUS.
        encoded_prompt = prompt_text.replace(" ", "%20")
        return f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){encoded_prompt}?width=1024&height=768&nologo=true&seed=42"

    except Exception as e:
        print(f"Image Gen Error: {e}")
        return "[https://via.placeholder.com/800x600?text=Image+Generation+Error](https://via.placeholder.com/800x600?text=Image+Generation+Error)"

@app.post("/api/generate")
async def generate_build(request: BuildRequest):
    try:
        # 1. Generate Concept JSON
        concept = generate_concept_with_gemini(request)
        
        # 2. Generate Image URL (Enhanced by Gemini Prompt)
        # Jika Anda sudah beli akses Imagen Google, ganti fungsi helper di atas.
        image_url = generate_image_with_imagen(concept['image_prompt'])
        
        # Gabungkan data
        response_data = {
            **concept,
            "images": {
                "cinematic": image_url,
                "palette": image_url, # Sementara pakai gambar sama untuk hemat request
                "angle": image_url,
                "blueprint": image_url
            }
        }
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status")
async def status():
    return {"status": "Backend Gemini Ready"}