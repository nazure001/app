import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Download, Copy, RotateCcw, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import {
  detectStyle,
  detectBiome,
  generateTitle,
  calculateDifficulty,
  generateLayers,
  generateImagePrompt,
  generateImageURL,
  BIOME_PALETTES,
  STYLE_TOUCHES
} from '../utils/generationEngine';

const AIGenerator = ({ concept, setConcept }) => {
  const { toast } = useToast();
  const [idea, setIdea] = useState(concept?.idea || '');
  const [style, setStyle] = useState(concept?.style || 'medieval');
  const [biome, setBiome] = useState(concept?.biome || 'plains');
  const [mood, setMood] = useState(concept?.mood || 'epic');
  const [time, setTime] = useState(concept?.time || 'golden');
  const [scale, setScale] = useState(concept?.scale || 'medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAutoDetect = () => {
    if (idea.trim()) {
      const detectedStyle = detectStyle(idea);
      const detectedBiome = detectBiome(idea);
      setStyle(detectedStyle);
      setBiome(detectedBiome);
      toast({
        title: "Auto-detection Complete",
        description: `Detected: ${detectedStyle} style, ${detectedBiome} biome`,
      });
    }
  };

  const handleGenerate = async () => {
    // 1. Validasi Input
    if (!idea.trim()) {
      toast({
        title: "Error",
        description: "Please enter a build idea first!",
        variant: "destructive"
      });
      return;
    }

    // 2. Mulai Loading
    setIsGenerating(true);

    try {
      // Pastikan URL ini sesuai dengan Hugging Face Space Anda yang aktif
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/generate";
      
      console.log("Connecting to AI Server...");

      // 3. Request ke Backend
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          style: style,
          biome: biome,
          scale: scale
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      // 4. Terima Data Cerdas dari Gemini
      const backendData = await response.json();
      console.log("AI Data Received:", backendData);
      
      // Ambil prompt dasar dari backend (misal: "A medieval castle in plains...")
      const basePrompt = backendData.image_prompt;

      // 5. Update State Aplikasi dengan Prompt Spesifik
      setConcept({
        // Data input user
        idea: idea,
        style: style,
        biome: biome,
        scale: scale,
        mood: mood,
        time: time,
        
        // Data hasil pemikiran Gemini
        title: backendData.title,
        difficulty: backendData.difficulty,
        layers: backendData.layers,
        palette: backendData.palette,
        tips: backendData.tips,
        features: backendData.features,
        
        // Gambar yang sudah di-generate URL-nya oleh backend
        images: backendData.images,
        
        // ⬇️ PERBAIKAN DI SINI: Modifikasi prompt agar unik per tombol ⬇️
        prompts: { 
            cinematic: basePrompt + ", cinematic view, detailed lighting, 8k render, photorealistic",
            palette: basePrompt + ", flat lay block palette style, organized grid, white background, material breakdown",
            angle: basePrompt + ", isometric view, 3d render, cute style, clear details, white background",
            blueprint: basePrompt + ", blueprint schematic style, blue background, technical drawing, white lines, top down view"
        }
      });

      toast({
        title: "Generation Complete!",
        description: `${backendData.title} created by Gemini AI.`,
      });

    } catch (error) {
      console.error("Generation Error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not connect to AI Server. Check if Hugging Face Space is Running.",
        variant: "destructive"
      });
    } finally {
      // 6. Matikan Loading
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIdea('');
    setStyle('medieval');
    setBiome('plains');
    setMood('epic');
    setTime('golden');
    setScale('medium');
    setConcept(null);
    toast({
      title: "Reset Complete",
      description: "All fields have been cleared.",
    });
  };

  const handleCopyPrompt = (promptType) => {
    if (concept?.prompts?.[promptType]) {
      navigator.clipboard.writeText(concept.prompts[promptType]);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    }
  };

  const handleExportJSON = () => {
    if (concept) {
      const dataStr = JSON.stringify(concept, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${concept.title.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Export Complete",
        description: "Build data exported successfully.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Build Configuration
          </CardTitle>
          <CardDescription className="text-stone-400">
            Describe your build idea and customize the parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Build Idea */}
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-white">Build Idea</Label>
            <Textarea
              id="idea"
              placeholder="e.g., A grand medieval castle with towers and a moat"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="bg-black/30 border-emerald-800/50 text-white placeholder:text-stone-500 min-h-[100px]"
            />
            <Button
              onClick={handleAutoDetect}
              variant="outline"
              size="sm"
              className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
            >
              Auto-Detect Style & Biome
            </Button>
          </div>

          {/* Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Style */}
            <div className="space-y-2">
              <Label htmlFor="style" className="text-white">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="medieval">Medieval</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="steampunk">Steampunk</SelectItem>
                  <SelectItem value="futuristic">Futuristic</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                  <SelectItem value="gothic">Gothic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Biome */}
            <div className="space-y-2">
              <Label htmlFor="biome" className="text-white">Biome</Label>
              <Select value={biome} onValueChange={setBiome}>
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="desert">Desert</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="mountain">Mountain</SelectItem>
                  <SelectItem value="snow">Snow</SelectItem>
                  <SelectItem value="plains">Plains</SelectItem>
                  <SelectItem value="taiga">Taiga</SelectItem>
                  <SelectItem value="nether">Nether</SelectItem>
                  <SelectItem value="end">End</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label htmlFor="mood" className="text-white">Mood</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="cozy">Cozy</SelectItem>
                  <SelectItem value="mystical">Mystical</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="clean">Clean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time/Lighting */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-white">Time/Lighting</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="golden">Golden Hour</SelectItem>
                  <SelectItem value="sunrise">Sunrise</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="fog">Foggy</SelectItem>
                  <SelectItem value="rain">Rainy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <Label htmlFor="scale" className="text-white">Scale</Label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="mega">Mega</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Build
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-stone-700 text-stone-300 hover:bg-stone-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {concept && (
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Concept */}
      {concept && (
        <div className="space-y-6">
          {/* Concept Header */}
          <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{concept.title}</CardTitle>
              <CardDescription className="text-stone-400 flex flex-wrap gap-2 mt-2">
                <Badge className="bg-emerald-600">{concept.style}</Badge>
                <Badge className="bg-amber-600">{concept.biome}</Badge>
                <Badge className="bg-blue-600">{concept.scale}</Badge>
                <Badge className="bg-purple-600">{concept.difficulty}</Badge>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Visual Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'cinematic', label: 'Main Cinematic View', icon: ImageIcon },
              { key: 'palette', label: 'Block Palette Layout', icon: ImageIcon },
              { key: 'angle', label: 'Isometric View', icon: ImageIcon },
              { key: 'blueprint', label: 'Blueprint Schematic', icon: ImageIcon }
            ].map((view) => {
              const Icon = view.icon;
              return (
                <Card key={view.key} className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      {view.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg bg-black/60 aspect-[4/3]">
                      {isGenerating ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        </div>
                      ) : (
                        <img
                          src={concept.images[view.key]}
                          alt={view.label}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600/1f2937/10b981?text=Loading...';
                          }}
                        />
                      )}
                    </div>
                    <Button
                      onClick={() => handleCopyPrompt(view.key)}
                      variant="outline"
                      size="sm"
                      className="w-full border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Prompt
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;
