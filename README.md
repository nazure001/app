# Minecraft Build Generator

A free, AI-powered Minecraft build concept generator with visual previews, circle tool, and detailed blueprints. Built to help the Minecraft community create amazing builds.

## Features

### 🎨 AI Build Generator
- Generate creative build concepts with intelligent style & biome detection
- Get 4 different visual outputs per concept:
  - Main Cinematic View
  - Block Palette Layout
  - Isometric View
  - Blueprint Schematic
- Customize style, biome, mood, lighting, and scale
- Export concepts as JSON

### 🖼️ Build Gallery
- 12 curated preset builds for inspiration
- Medieval, Modern, Fantasy, Japanese, Steampunk, and more
- Quick-start templates with pre-configured parameters

### ⭕ Circle Tool
- Generate perfect Minecraft circles
- Adjustable radius (1-50 blocks)
- Outline or filled mode
- Real-time canvas preview
- Export as PNG or JSON with block coordinates

### 📋 Blueprint Pack
- Detailed project manifest
- Step-by-step construction layers
- Complete material planner (main palette, accents, details, lighting)
- Pro tips for each build style
- Key features to include

## Tech Stack

- **Frontend**: React 19
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Icons**: Lucide React
- **AI Images**: pollinations.ai (free, no API key required)
- **Build Logic**: Rule-based generation system

## Deployment on Vercel

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `yarn build`
     - Output Directory: `build`
   - Click Deploy!

### Environment Variables
No environment variables needed! The app uses:
- pollinations.ai for free AI image generation (no key required)
- Client-side generation logic (no backend needed)
- LocalStorage for data persistence

## Local Development

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   yarn install
   ```

2. **Start development server**
   ```bash
   yarn start
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Generate a Build
1. Go to **AI Generator** tab
2. Enter your build idea (e.g., "A grand medieval castle with towers")
3. Click **Auto-Detect Style & Biome** or manually select options
4. Customize mood, lighting, and scale
5. Click **Generate Build**
6. View 4 different visual perspectives
7. Export as JSON if needed

### Use Gallery Presets
1. Go to **Gallery** tab
2. Browse 12 curated presets
3. Click **Use This Preset** on any build
4. Automatically loaded into AI Generator
5. Customize and regenerate as needed

### Create Perfect Circles
1. Go to **Circle Tool** tab
2. Adjust radius with slider or input
3. Choose Outline or Filled mode
4. View real-time preview on canvas
5. Download as PNG or export JSON with block coordinates

### View Blueprint Details
1. Generate a build concept first
2. Go to **Blueprint Pack** tab
3. View project manifest with specs
4. Follow step-by-step construction layers
5. Check material planner for all blocks needed
6. Read pro tips for your build style
7. Export complete blueprint as JSON

## Build Styles Available
- Medieval (castles, fortresses, villages)
- Modern (contemporary houses, cities)
- Fantasy (magical, mystical structures)
- Japanese (temples, zen gardens)
- Steampunk (industrial, mechanical)
- Futuristic (sci-fi, cyberpunk)
- Rustic (farmhouses, cottages)
- Gothic (dark, dramatic architecture)

## Biomes Supported
- Forest
- Desert
- Ocean
- Mountain
- Snow
- Plains
- Taiga
- Nether
- End

## Features Comparison

| Feature | Free Version |
|---------|--------------|
| Build Generation | ✅ Unlimited |
| Visual Outputs | ✅ 4 per build |
| Gallery Presets | ✅ 12 included |
| Circle Tool | ✅ Full access |
| Blueprint Export | ✅ JSON format |
| API Costs | ✅ Zero |
| Community Access | ✅ Free forever |

## Contributing

This is a free tool for the Minecraft community. Contributions are welcome!

## License

Free for community use. Built with ❤️ for Minecraft builders.

## Support

For issues or questions, please open an issue on GitHub.

---

**Made for the Minecraft community** 🎮⛏️
