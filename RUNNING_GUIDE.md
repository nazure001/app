# 🚀 Panduan Menjalankan Minecraft Builder Toolkit

## ✅ Status Upgrade: SELESAI
Semua fitur telah diimplementasikan sesuai ketentuan!

## 📋 Langkah Selanjutnya

### 1. Jalankan Backend Server
```bash
# Pastikan di dalam workspace vscode-vfs://github/nazure001/app
python -m uvicorn backend.server:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Jalankan Frontend (Terminal Baru)
```bash
cd frontend
npm install
npm start
```

### 3. Test Fitur-Fitur Baru
Buka browser ke `http://localhost:3000` dan test:

- ✅ **AI Build Generator** - Generate ide build
- ✅ **Biome Build Planner** - Adaptasi dengan biome
- ✅ **Difficulty Analyzer** - Analisis kompleksitas
- ✅ **Block Palette Generator** - Daftar material
- ✅ **Build Size Calculator** - Hitung dimensi
- ✅ **Blueprint Generator** - Layout bangunan
- ✅ **Schematic Export** - Export .schem file
- ✅ **Redstone Planner** - Desain automation
- ✅ **Inspiration Gallery** - Koleksi build
- ✅ **AI Prompt Builder** - Enhance prompt AI

### 4. Deploy ke Production (Opsional)
```bash
# Build frontend
cd frontend && npm run build

# Deploy backend ke Hugging Face Spaces
# (gunakan Hugging Face CLI atau manual upload)
```

## 🎯 Fitur Utama yang Bisa Ditest

1. **Generate Build Concept** → Lihat hasil AI
2. **Analyze Difficulty** → Cek rating kompleksitas
3. **Generate Block Palette** → Lihat daftar material
4. **Plan Biome Adaptation** → Sesuaikan dengan environment
5. **Calculate Size** → Hitung dimensi optimal
6. **Design Redstone** → Buat automation system
7. **Build AI Prompt** → Enhance prompt untuk generator lain

## 🔧 Jika Ada Error

### Backend Error:
```bash
pip install -r backend/requirements.txt
```

### Frontend Error:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port Conflict:
- Backend: Ganti port 8000 ke 8001
- Frontend: Ganti port 3000 ke 3001

## 📊 Hasil Akhir

Aplikasi sekarang berubah dari:
- **Generator ide sederhana** 
- Menjadi **Minecraft Builder Toolkit lengkap**

Dengan 10 fitur utama yang saling terintegrasi! 🎮🏗️