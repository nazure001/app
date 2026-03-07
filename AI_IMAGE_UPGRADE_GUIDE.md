# Minecraft Build Generator - AI Image Upgrade Guide

## 🎨 What's New

This upgrade enhances the AI image generation with **better quality, higher resolution, and intelligent fallback support**.

### Key Improvements

1. **Google Gemini Imagen API Integration** 
   - Added support for Google's Imagen-3 image generation model
   - Generates higher quality, more detailed Minecraft build visualizations
   - Specialized prompts for each view type (cinematic, palette, isometric, blueprint)

2. **Intelligent Fallback System**
   - Primary: Google Gemini Imagen (if API key available)
   - Secondary: Pollinations.ai (free, always available)
   - Automatic failover with no downtime

3. **Enhanced Image Previews**
   - Larger preview size (16:9 aspect ratio, 1024x576)
   - Hover effects and smooth transitions
   - Direct image opening in full resolution
   - Better error handling with placeholder support

4. **Improved Prompting**
   - Specialized system prompts for each visualization type
   - Cinematic: Dramatic lighting, photorealistic render
   - Palette: Grid layout, material breakdown
   - Isometric: Technical 3D view with clear details
   - Blueprint: Architectural drawing style

## 🚀 Setup Instructions

### 1. Install Dependencies

Update your backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Key additions:
- `google-genai>=1.66.0` - New Google GenAI SDK for image generation
- `google-generativeai>=0.8.3` - Kept for backward compatibility (text generation)

### 2. Environment Configuration

Set your API key (choose one method):

**Method A: Using `.env` file (Recommended for local)**
```env
GEMINI_API_KEY=your_gemini_api_key_here
# or use GENAI_API_KEY if you prefer
GENAI_API_KEY=your_genai_api_key_here
```

**Method B: Using environment variables (For production/HuggingFace Spaces)**
```bash
export GEMINI_API_KEY="your_key_here"
export GENAI_API_KEY="your_key_here"
```

**Method C: Hardcoding in deploy settings**
Set via HuggingFace Secrets or similar platform

### 3. Getting API Keys

**Google Gemini API Key:**
1. Go to [Google AI Studio](https://ai.google.dev/studio)
2. Click "Get API Key"
3. Create a new API key or use existing
4. Copy the key to your environment

**Note:** Both `GEMINI_API_KEY` and `GENAI_API_KEY` are supported. If both exist, `GENAI_API_KEY` takes priority for images.

## 📊 Architecture Changes

### Backend Updates (`backend/server.py`)

```python
# Now supports two clients:
1. legacy_genai     # For text/concept generation (stable, proven)
2. genai_client     # For image generation (new, higher quality)

# If GENAI_API_KEY is missing, system falls back to Pollinations.ai
# This ensures the app works even without a Google API key!
```

### New Functions

- `generate_images_with_gemini()` - Calls Google Imagen API with specialized prompts
- Enhanced error handling with automatic fallback to Pollinations

### Frontend Updates (`frontend/src/components/AIGenerator.jsx`)

```jsx
// Enhanced preview cards:
1. Larger, higher aspect ratio (16:9)
2. Hover animations
3. Direct image download button
4. Better description for each view
5. Improved loading states
```

## ⚙️ Configuration Options

### Image Quality Settings

In `generate_images_with_gemini()`, adjust:

```python
config={
    "number_of_images": 1,           # 1-4 images
    "safety_filter_level": "block_most",  # Safety filtering
    "person_generation": "allow_adult",   # Person generation (if needed)
}
```

### Prompt Customization

Edit `view_prompts` dict to change image generation style for each view type.

## 🔄 Fallback Behavior

```
User Request
    ↓
[Try Gemini Imagen]
    ├─ Success → Return high-quality image from Google
    └─ Fail/Missing key → Use Pollinations.ai
```

### When Pollin will be used:
- `GENAI_API_KEY` not set
- Google API returns error
- Network issues
- Rate limiting

## 📈 Performance & Costs

| Service | Speed | Quality | Cost |
|---------|-------|---------|------|
| Gemini Imagen-3 | ~5-10s | ⭐⭐⭐⭐⭐ | $0.04/image |
| Pollinations.ai | ~2-5s | ⭐⭐⭐ | Free |

**Recommendation:** Use Gemini with generous rate limits, fall back to Pollinations for free users.

## 🧪 Testing

### Local Testing

```bash
cd backend
python server.py
# Server runs on http://localhost:8000/

# Test endpoint:
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "ancient pyramid",
    "style": "egyptian",
    "biome": "desert",
    "scale": "large"
  }'
```

### Troubleshooting

**Issue: Images not loading**
- Check API key is set correctly
- Verify network connectivity
- Check app console for error messages

**Issue: Slow performance**
- Image generation takes 5-15 seconds
- This is normal, especially first time
- UI shows loading spinner, be patient

**Issue: "fallback to Pollinations" appearing often**
- Gemini API key may be invalid
- May have hit rate limits
- Check API quota in Google Cloud Console

## 🔐 Security Notes

- API keys are stored in environment variables (secure)
- No keys hardcoded in source
- Fallback to free service means service still works without premium key
- All external URLs are from trusted services

## 📚 API Endpoints

### Generate Build Concept & Images

**POST** `/api/generate`

Request:
```json
{
  "idea": "Grand castle",
  "style": "medieval",
  "biome": "plains",
  "scale": "mega"
}
```

Response:
```json
{
  "title": "Royal Castle of the Grasslands",
  "difficulty": "Advanced",
  "estimatedTime": "5-7 hours",
  "palette": {...},
  "layers": [...],
  "images": {
    "cinematic": "https://...",
    "palette": "https://...",
    "angle": "https://...",
    "blueprint": "https://..."
  }
}
```

## 🚢 Deployment

### HuggingFace Spaces

1. Update repo with new code
2. Add secrets:
   - `GEMINI_API_KEY` - Your API key
   - `GENAI_API_KEY` - (Optional, same key)
3. Restart space
4. Test at your space URL

### Local Docker

```dockerfile
ENV GENAI_API_KEY=your_key_here
RUN pip install -r backend/requirements.txt
CMD ["python", "backend/server.py"]
```

### NextJS Frontend Considerations

No changes needed on frontend side - works with existing installation!
Just update the component for better UI preview.

## 🔍 Monitoring

Watch server logs for:
- `✓ Generated cinematic image via Gemini` - Success
- `✗ Error generating ...` - Fallback triggered
- API rate limit warnings
- Network errors

## 🎯 Future Enhancements

- [ ] Image quality/style selector in UI
- [ ] Multiple model options (Imagen-2, Flux, etc.)
- [ ] Caching of generated images
- [ ] Batch image generation
- [ ] Image editing/refinement tools
- [ ] Video generation support

## 📞 Support

For issues or questions:
1. Check error logs in browser console
2. Verify API keys in environment
3. Test with Pollinations fallback to isolate issue
4. Check Google Cloud Console for quota limits

---

**Update Date:** March 7, 2026  
**Version:** 2.0 - AI Enhancement Update
