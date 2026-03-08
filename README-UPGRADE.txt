# Minecraft Builder Toolkit Upgrade Pack

File ini berisi upgrade besar-besaran untuk repo `nazure001/app`.

## Isi
- `App.js` baru yang mengubah app menjadi **Minecraft Builder Toolkit**
- Sudah mencakup:
  - AI Build Generator
  - Biome Build Planner
  - Difficulty Analyzer
  - Block Palette Generator
  - Build Size Calculator
  - Blueprint Generator
  - Schematic Pack Export
  - Redstone Planner
  - Inspiration Gallery
  - AI Prompt Builder

## Cara pakai
1. Backup file lama: `frontend/src/App.js`
2. Ganti dengan file `App.js` dari paket ini
3. Jalankan:
   - `cd frontend`
   - `yarn install`
   - `yarn start`

## Catatan penting
Export yang disediakan sekarang adalah **schematic-ready JSON pack**.
Kalau kamu ingin **file `.schem` binary asli**, tambahkan writer NBT seperti:
- `prismarine-nbt`
- atau backend Node kecil untuk serialize WorldEdit schematic

Hook untuk fitur export itu sudah dipisahkan di tombol **Export Schematic Pack**.
