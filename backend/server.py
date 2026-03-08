from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
from starlette.middleware.cors import CORSMiddleware
import urllib.parse
import random
import math
from typing import List, Dict, Optional
from enum import Enum

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

class BiomePlannerRequest(BaseModel):
    biome: str
    build_type: str
    scale: str = "medium"

class DifficultyAnalyzerRequest(BaseModel):
    build_concept: Dict
    player_skill: str = "intermediate"

class BlockPaletteRequest(BaseModel):
    build_concept: Dict
    include_redstone: bool = False

class SizeCalculatorRequest(BaseModel):
    build_type: str
    scale: str
    floors: int = 1
    wings: int = 1

class BlueprintGeneratorRequest(BaseModel):
    build_concept: Dict
    grid_size: int = 16

class SchematicExportRequest(BaseModel):
    build_concept: Dict
    format: str = "schem"

class RedstonePlannerRequest(BaseModel):
    automation_type: str
    complexity: str = "basic"
    power_source: str = "redstone"

class PromptBuilderRequest(BaseModel):
    user_prompt: str
    style_hints: Optional[str] = None
    biome_hints: Optional[str] = None

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



# ===== NEW FEATURES FUNCTIONS =====

def biome_build_planner(biome: str, build_type: str, scale: str):
    """
    Menyesuaikan desain bangunan dengan biome tertentu
    """
    biome_adaptations = {
        "plains": {
            "materials": ["Oak Wood", "Hay Bales", "Stone", "Glass"],
            "features": ["Open spaces", "Windmills", "Farms", "Paths"],
            "challenges": ["Limited natural cover", "Open to mobs"],
            "advantages": ["Easy access", "Good farming land"]
        },
        "forest": {
            "materials": ["Spruce Wood", "Leaves", "Moss", "Dirt"],
            "features": ["Tree integration", "Hidden entrances", "Natural camouflage"],
            "challenges": ["Dense vegetation", "Limited light"],
            "advantages": ["Natural cover", "Wood abundance"]
        },
        "desert": {
            "materials": ["Sandstone", "Cactus", "Terracotta", "Gold"],
            "features": ["Sand dune integration", "Water conservation", "Heat resistance"],
            "challenges": ["Extreme heat", "Sand movement", "Limited water"],
            "advantages": ["Unique architecture", "Rare materials"]
        },
        "mountain": {
            "materials": ["Stone", "Snow", "Ice", "Emerald"],
            "features": ["Cliff integration", "Snow camouflage", "Elevated views"],
            "challenges": ["Steep terrain", "Avalanche risk", "Cold weather"],
            "advantages": ["Strategic positions", "Mining access"]
        },
        "ocean": {
            "materials": ["Prismarine", "Sea Lanterns", "Coral", "Dark Prismarine"],
            "features": ["Underwater chambers", "Boat access", "Coral gardens"],
            "challenges": ["Water pressure", "Mob spawning", "Limited oxygen"],
            "advantages": ["Hidden locations", "Unique resources"]
        }
    }
    
    adaptation = biome_adaptations.get(biome.lower(), biome_adaptations["plains"])
    
    return {
        "biome": biome,
        "build_type": build_type,
        "scale": scale,
        "material_adaptations": adaptation["materials"],
        "structural_features": adaptation["features"],
        "environmental_challenges": adaptation["challenges"],
        "biome_advantages": adaptation["advantages"],
        "recommended_modifications": [
            f"Use {adaptation['materials'][0]} as primary building material",
            f"Incorporate {adaptation['features'][0]} into design",
            f"Address {adaptation['challenges'][0]} in planning"
        ]
    }

def difficulty_analyzer(build_concept: Dict, player_skill: str):
    """
    Menentukan tingkat kesulitan build berdasarkan konsep dan skill player
    """
    # Hitung kompleksitas berdasarkan berbagai faktor
    complexity_score = 0
    
    # Faktor ukuran
    scale_multipliers = {"small": 1, "medium": 2, "large": 3, "massive": 4}
    complexity_score += scale_multipliers.get(build_concept.get("scale", "medium"), 2)
    
    # Faktor material variety
    palette = build_concept.get("palette", {})
    total_blocks = sum(len(blocks) for blocks in palette.values())
    complexity_score += min(total_blocks // 5, 3)  # Max 3 poin untuk variety
    
    # Faktor fitur khusus
    features = build_concept.get("features", [])
    special_features = ["redstone", "automation", "farm", "mob farm", "transport"]
    for feature in features:
        if any(special in feature.lower() for special in special_features):
            complexity_score += 1
    
    # Tentukan difficulty berdasarkan score
    if complexity_score <= 3:
        base_difficulty = "Beginner"
    elif complexity_score <= 6:
        base_difficulty = "Intermediate" 
    else:
        base_difficulty = "Advanced"
    
    # Adjust berdasarkan player skill
    skill_adjustments = {
        "beginner": {"Beginner": "Beginner", "Intermediate": "Intermediate", "Advanced": "Expert"},
        "intermediate": {"Beginner": "Beginner", "Intermediate": "Intermediate", "Advanced": "Advanced"},
        "advanced": {"Beginner": "Beginner", "Intermediate": "Beginner", "Advanced": "Intermediate"}
    }
    
    adjusted_difficulty = skill_adjustments.get(player_skill, skill_adjustments["intermediate"]).get(base_difficulty, base_difficulty)
    
    return {
        "calculated_difficulty": adjusted_difficulty,
        "complexity_score": complexity_score,
        "skill_level": player_skill,
        "estimated_time": f"{complexity_score * 2}-{complexity_score * 3} hours",
        "recommended_tools": ["Basic tools", "Advanced tools", "Redstone knowledge"] if adjusted_difficulty == "Advanced" else ["Basic tools"],
        "challenges": [f"Complexity score: {complexity_score}/10", f"Requires {adjusted_difficulty} skills"]
    }

def block_palette_generator(build_concept: Dict, include_redstone: bool = False):
    """
    Generate daftar blok yang diperlukan berdasarkan konsep build
    """
    palette = build_concept.get("palette", {})
    
    # Expand palette dengan quantity estimates
    expanded_palette = {}
    for category, blocks in palette.items():
        expanded_palette[category] = []
        for block in blocks:
            # Estimate quantity berdasarkan scale
            scale = build_concept.get("scale", "medium")
            base_quantity = {"small": 10, "medium": 50, "large": 200, "massive": 500}.get(scale, 50)
            
            expanded_palette[category].append({
                "block": block,
                "quantity": base_quantity,
                "source": "Crafting" if "wood" in block.lower() else "Mining"
            })
    
    # Add redstone components if requested
    if include_redstone:
        expanded_palette["redstone"] = [
            {"block": "Redstone Dust", "quantity": 20, "source": "Mining"},
            {"block": "Redstone Torch", "quantity": 10, "source": "Crafting"},
            {"block": "Lever", "quantity": 5, "source": "Crafting"}
        ]
    
    return {
        "build_title": build_concept.get("title", "Unknown Build"),
        "palette": expanded_palette,
        "total_blocks": sum(item["quantity"] for category in expanded_palette.values() for item in category),
        "shopping_list": [item["block"] for category in expanded_palette.values() for item in category]
    }

def build_size_calculator(build_type: str, scale: str, floors: int = 1, wings: int = 1):
    """
    Estimasi ukuran bangunan dalam blocks
    """
    # Base dimensions berdasarkan tipe build
    base_dimensions = {
        "house": {"width": 7, "length": 9, "height": 6},
        "castle": {"width": 20, "length": 25, "height": 15},
        "tower": {"width": 7, "length": 7, "height": 20},
        "farm": {"width": 15, "length": 20, "height": 3},
        "shop": {"width": 8, "length": 12, "height": 5},
        "temple": {"width": 12, "length": 16, "height": 10}
    }
    
    base = base_dimensions.get(build_type.lower(), base_dimensions["house"])
    
    # Scale multipliers
    scale_mult = {"small": 0.7, "medium": 1.0, "large": 1.5, "massive": 2.0}.get(scale, 1.0)
    
    # Calculate dimensions
    width = math.ceil(base["width"] * scale_mult)
    length = math.ceil(base["length"] * scale_mult)
    height = math.ceil(base["height"] * scale_mult * floors)
    
    # Account for wings
    total_width = width + (wings - 1) * width * 0.6
    
    # Volume calculation
    volume = width * length * height
    surface_area = 2 * (width * length + width * height + length * height)
    
    return {
        "build_type": build_type,
        "scale": scale,
        "dimensions": {
            "width": width,
            "length": length,
            "height": height,
            "floors": floors,
            "wings": wings
        },
        "metrics": {
            "volume_blocks": volume,
            "surface_area": surface_area,
            "estimated_time": f"{volume // 100} minutes",
            "chunk_area": f"{math.ceil(width/16)}x{math.ceil(length/16)} chunks"
        }
    }

def blueprint_generator(build_concept: Dict, grid_size: int = 16):
    """
    Membuat layout bangunan dalam format grid
    """
    # Simple blueprint generation berdasarkan tipe build
    build_type = build_concept.get("idea", "").lower()
    
    if "castle" in build_type:
        blueprint = [
            ["W", "W", "W", "W", "W", "G", "W", "W", "W", "W", "W"],
            ["W", " ", " ", " ", "W", "G", "W", " ", " ", " ", "W"],
            ["W", " ", "D", " ", "W", "G", "W", " ", "D", " ", "W"],
            ["W", " ", " ", " ", "W", "G", "W", " ", " ", " ", "W"],
            ["W", "W", "W", "W", "W", "G", "W", "W", "W", "W", "W"],
            ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"],
            ["T", " ", " ", " ", "T", " ", "T", " ", " ", " ", "T"]
        ]
        legend = {"W": "Walls", "G": "Gate", "D": "Door", "T": "Tower"}
    elif "house" in build_type:
        blueprint = [
            ["W", "W", "W", "W", "W"],
            ["W", " ", "D", " ", "W"],
            ["W", " ", " ", " ", "W"],
            ["W", " ", " ", " ", "W"],
            ["W", "W", "W", "W", "W"]
        ]
        legend = {"W": "Walls", "D": "Door"}
    else:
        # Generic blueprint
        blueprint = [
            ["B", "B", "B"],
            ["B", " ", "B"],
            ["B", "B", "B"]
        ]
        legend = {"B": "Building Block"}
    
    return {
        "title": build_concept.get("title", "Blueprint"),
        "grid": blueprint,
        "legend": legend,
        "grid_size": grid_size,
        "dimensions": f"{len(blueprint[0])}x{len(blueprint)} blocks"
    }

def schematic_exporter(build_concept: Dict, format: str = "schem"):
    """
    Export build ke format schematic (simulasi)
    """
    # Dalam implementasi nyata, ini akan generate file .schem
    # Untuk sekarang, return metadata dan struktur data
    
    blueprint = blueprint_generator(build_concept)
    
    schematic_data = {
        "format": format,
        "version": "1.0",
        "metadata": {
            "title": build_concept.get("title", "Minecraft Build"),
            "author": "AI Generator",
            "description": build_concept.get("idea", ""),
            "date_created": "2024-01-01"
        },
        "dimensions": {
            "width": len(blueprint["grid"][0]),
            "height": len(blueprint["grid"]),
            "length": 1  # 2D blueprint
        },
        "blocks": blueprint["grid"],
        "palette": blueprint["legend"]
    }
    
    return {
        "schematic_data": schematic_data,
        "download_url": f"/api/schematic/{build_concept.get('title', 'build').replace(' ', '_')}.{format}",
        "file_size": f"{len(str(schematic_data))} bytes",
        "compatible_with": ["WorldEdit", "MCEdit", "Schematica"]
    }

def redstone_planner(automation_type: str, complexity: str = "basic", power_source: str = "redstone"):
    """
    Merancang mekanisme redstone untuk automation
    """
    designs = {
        "door": {
            "basic": {
                "components": ["Pressure Plate", "Redstone Dust", "Door"],
                "layout": "Pressure Plate → Redstone Dust → Door",
                "power_source": power_source
            },
            "advanced": {
                "components": ["Pressure Plate", "Redstone Dust", "Door", "Redstone Torch", "Lever"],
                "layout": "Pressure Plate → Redstone Dust → Door with toggle mechanism",
                "power_source": power_source
            }
        },
        "farm": {
            "basic": {
                "components": ["Observer", "Dispenser", "Water", "Redstone Dust"],
                "layout": "Observer → Redstone Dust → Dispenser for automatic harvesting",
                "power_source": "Observer"
            },
            "advanced": {
                "components": ["Observer", "Dispenser", "Piston", "Redstone Dust", "Comparator"],
                "layout": "Multi-stage automatic farm with timer and collection system",
                "power_source": "Observer + Clock"
            }
        },
        "trap": {
            "basic": {
                "components": ["Pressure Plate", "Redstone Dust", "Dispenser", "Arrow"],
                "layout": "Pressure Plate → Redstone Dust → Dispenser with arrows",
                "power_source": power_source
            },
            "advanced": {
                "components": ["Pressure Plate", "Redstone Dust", "Dispenser", "TNT", "Observer"],
                "layout": "Multi-trap system with detection and multiple dispensers",
                "power_source": power_source
            }
        }
    }
    
    design = designs.get(automation_type.lower(), designs["door"])
    selected_design = design.get(complexity, design["basic"])
    
    return {
        "automation_type": automation_type,
        "complexity": complexity,
        "design": selected_design,
        "estimated_cost": len(selected_design["components"]),
        "difficulty": "Advanced" if complexity == "advanced" else "Intermediate",
        "tips": [
            f"Use {power_source} as power source",
            "Test each component before connecting",
            "Use redstone dust for signal transmission"
        ]
    }

def ai_prompt_builder(user_prompt: str, style_hints: Optional[str] = None, biome_hints: Optional[str] = None):
    """
    Membangun prompt AI yang lebih baik dari input user
    """
    # Enhance user prompt dengan context tambahan
    enhanced_prompt = user_prompt
    
    if style_hints:
        enhanced_prompt += f" in {style_hints} style"
    
    if biome_hints:
        enhanced_prompt += f" located in {biome_hints} biome"
    
    # Add technical details untuk better AI generation
    technical_enhancements = [
        "minecraft building",
        "detailed block textures",
        "realistic lighting",
        "architectural accuracy",
        "8k resolution",
        "photorealistic render"
    ]
    
    full_prompt = f"{enhanced_prompt}, {', '.join(technical_enhancements)}"
    
def inspiration_gallery():
    """
    Koleksi build dari user/AI untuk inspirasi
    """
    # Dalam implementasi nyata, ini akan dari database
    # Untuk sekarang, return sample builds
    sample_builds = [
        {
            "id": 1,
            "title": "Medieval Castle",
            "author": "AI Generator",
            "style": "medieval",
            "biome": "plains",
            "difficulty": "Advanced",
            "likes": 245,
            "image_url": "https://example.com/castle.jpg",
            "tags": ["castle", "medieval", "fortress"]
        },
        {
            "id": 2,
            "title": "Underground Base",
            "author": "Player123",
            "style": "modern",
            "biome": "mountain",
            "difficulty": "Intermediate",
            "likes": 189,
            "image_url": "https://example.com/base.jpg",
            "tags": ["base", "underground", "modern"]
        },
        {
            "id": 3,
            "title": "Sky Island",
            "author": "AI Generator",
            "style": "fantasy",
            "biome": "ocean",
            "difficulty": "Expert",
            "likes": 312,
            "image_url": "https://example.com/island.jpg",
            "tags": ["sky", "island", "fantasy"]
        }
    ]
    
    return {
        "builds": sample_builds,
        "total": len(sample_builds),
        "categories": ["medieval", "modern", "fantasy", "underground"],
        "featured": sample_builds[0]
    }
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

    }

@app.get("/")
def read_root():
    return {"status": "Active", "engine": "Gemini + Hugging Face"}

# ===== NEW API ENDPOINTS =====

@app.post("/api/biome-planner")
async def api_biome_planner(request: BiomePlannerRequest):
    result = biome_build_planner(request.biome, request.build_type, request.scale)
    return result

@app.post("/api/difficulty-analyzer")
async def api_difficulty_analyzer(request: DifficultyAnalyzerRequest):
    result = difficulty_analyzer(request.build_concept, request.player_skill)
    return result

@app.post("/api/block-palette")
async def api_block_palette(request: BlockPaletteRequest):
    result = block_palette_generator(request.build_concept, request.include_redstone)
    return result

@app.post("/api/size-calculator")
async def api_size_calculator(request: SizeCalculatorRequest):
    result = build_size_calculator(request.build_type, request.scale, request.floors, request.wings)
    return result

@app.post("/api/blueprint-generator")
async def api_blueprint_generator(request: BlueprintGeneratorRequest):
    result = blueprint_generator(request.build_concept, request.grid_size)
    return result

@app.post("/api/schematic-export")
async def api_schematic_export(request: SchematicExportRequest):
    result = schematic_exporter(request.build_concept, request.format)
    return result

@app.post("/api/redstone-planner")
async def api_redstone_planner(request: RedstonePlannerRequest):
    result = redstone_planner(request.automation_type, request.complexity, request.power_source)
    return result

@app.post("/api/prompt-builder")
async def api_prompt_builder(request: PromptBuilderRequest):
    result = ai_prompt_builder(request.user_prompt, request.style_hints, request.biome_hints)
    return result

@app.get("/api/inspiration-gallery")
async def api_inspiration_gallery():
    result = inspiration_gallery()
    return result
