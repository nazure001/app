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

# Konfigurasi Gemini / GenAI (text + images)
# The old `google.generativeai` package is deprecated; we also install the
# new `google-genai` client to take advantage of the Gemini image models.
# You can set either GEMINI_API_KEY (old) or GENAI_API_KEY. If both are present
# the new client will be preferred for image generation.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GENAI_API_KEY = os.getenv("GENAI_API_KEY") or GEMINI_API_KEY  # fallback

if not GEMINI_API_KEY and not GENAI_API_KEY:
    print("WARNING: No Gemini/GenAI API key provided!")

# configure the legacy text/chat client (used for concept generation)
import google.generativeai as legacy_genai
legacy_genai.configure(api_key=GEMINI_API_KEY)

# optionally create a new GenAI client for images
from google import genai as new_genai

genai_client = None
if GENAI_API_KEY:
    try:
        genai_client = new_genai.Client(api_key=GENAI_API_KEY)
    except Exception as e:
        # if the key is invalid or missing the library will raise; log and continue
        print("Could not initialize new GenAI client, falling back to Pollinations:", e)
        genai_client = None

# helper used internally for text generation
# keep using legacy_genai.GenerativeModel for compatibility with existing code


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
    model = legacy_genai.GenerativeModel('gemini-1.5-flash')
    
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
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=576&nologo=true&seed={seed}&model=flux"


async def generate_images_with_gemini(base_prompt: str, request: BuildRequest):
    """
    Generate images using Google Gemini Imagen API for better quality.
    Returns dict with keys: cinematic, palette, angle, blueprint
    Falls back to Pollinations if Gemini API fails.
    """
    if not genai_client:
        return {}
    
    try:
        images_dict = {}
        
        # Define specialized prompts for each view type
        view_prompts = {
            "cinematic": f"{base_prompt}, cinematic angle, dramatic golden hour lighting, detailed minecraft blocks, photorealistic render, epic atmosphere, high quality, 8k resolution",
            "palette": f"{base_prompt}, block palette showcase, material breakdown, organized grid layout, clean white background, inventory view style, all blocks visible, 8k",
            "angle": f"{base_prompt}, isometric 3D view, technical rendering, clear block details, schematic style, white background, architectural drawing, 8k resolution",
            "blueprint": f"{base_prompt}, blueprint architectural drawing style, technical schematic, top-down view, blue lines on white, grid overlay, construction details, 8k"
        }
        
        # Try to generate each image variant
        for view_type, enhanced_prompt in view_prompts.items():
            try:
                response = genai_client.models.generate_images(
                    model="imagen-3",
                    prompt=enhanced_prompt,
                    config={
                        "number_of_images": 1,
                        "safety_filter_level": "block_most",
                        "person_generation": "allow_adult",
                    }
                )
                
                # Extract image URL from response
                if response.generated_images and len(response.generated_images) > 0:
                    image_url = response.generated_images[0].gcs_uri
                    if image_url:
                        images_dict[view_type] = image_url
                        print(f"✓ Generated {view_type} image via Gemini")
                    else:
                        print(f"✗ No URL in response for {view_type}, using Pollinations fallback")
                        images_dict[view_type] = generate_safe_image_url(enhanced_prompt)
                else:
                    print(f"✗ No images in response for {view_type}, using Pollinations fallback")
                    images_dict[view_type] = generate_safe_image_url(enhanced_prompt)
                    
            except Exception as e:
                print(f"✗ Error generating {view_type}: {e}, using Pollinations fallback")
                images_dict[view_type] = generate_safe_image_url(enhanced_prompt)
        
        return images_dict if len(images_dict) == 4 else {}
        
    except Exception as e:
        print(f"Gemini image generation failed: {e}")
        print("Falling back to Pollinations...")
        return {}



@app.post("/api/generate")
async def generate_build(request: BuildRequest):
    # Tahap 1: Pakai Gemini untuk mikir konsep & bikin prompt gambar
    concept_data = generate_gemini_concept(request)
    
    # Tahap 2: Generate images using either Google GenAI (Imagen) or fallback to Pollinations
    prompt_for_image = concept_data.get("image_prompt", f"{request.style} {request.idea} minecraft build")
    
    # Try to use Google Gemini image generation first (higher quality)
    images_dict = {}
    if genai_client:
        images_dict = await generate_images_with_gemini(
            prompt_for_image,
            request
        )
    
    # Fallback to Pollinations if Gemini unavailable or failed
    if not images_dict:
        images_dict = {
            "cinematic": generate_safe_image_url(prompt_for_image + ", cinematic view, detailed lighting, 8k render, photorealistic, voxel art"),
            "palette": generate_safe_image_url(prompt_for_image + ", flat lay block palette style, 8k, organized grid, white background"),
            "angle": generate_safe_image_url(prompt_for_image + ", Isometric technical drawing, 8k, schematic style, white background"),
            "blueprint": generate_safe_image_url(prompt_for_image + ", blueprint schematic style, 8k, blue background, technical drawing")
        }
    
    # Tahap 3: Gabungkan data untuk dikirim ke Frontend
    return {
        **concept_data,
        "images": images_dict
    }

@app.get("/")
def read_root():
    return {"status": "Active", "engine": "Gemini + Hugging Face"}
