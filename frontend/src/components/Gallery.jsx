import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Gallery = ({ onNavigate, setConcept }) => {
  const { toast } = useToast();
  const [selectedPreset, setSelectedPreset] = useState(null);

  const presets = [
    {
      id: 1,
      title: 'Medieval Castle',
      idea: 'Grand fortress with multiple towers',
      style: 'medieval',
      biome: 'plains',
      mood: 'epic',
      time: 'golden',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20medieval%20castle%20with%20towers%20plains%20biome%20epic%20golden%20hour?width=400&height=300&nologo=true&seed=101'
    },
    {
      id: 2,
      title: 'Modern Beach House',
      idea: 'Contemporary glass house by the ocean',
      style: 'modern',
      biome: 'ocean',
      mood: 'clean',
      time: 'sunrise',
      scale: 'medium',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20modern%20beach%20house%20glass%20ocean%20biome%20clean%20sunrise?width=400&height=300&nologo=true&seed=102'
    },
    {
      id: 3,
      title: 'Fantasy Wizard Tower',
      idea: 'Magical tower with floating crystals',
      style: 'fantasy',
      biome: 'forest',
      mood: 'mystical',
      time: 'night',
      scale: 'medium',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20fantasy%20wizard%20tower%20magical%20forest%20biome%20mystical%20night?width=400&height=300&nologo=true&seed=103'
    },
    {
      id: 4,
      title: 'Japanese Temple',
      idea: 'Traditional zen temple with gardens',
      style: 'japanese',
      biome: 'taiga',
      mood: 'cozy',
      time: 'golden',
      scale: 'medium',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20japanese%20temple%20zen%20garden%20taiga%20biome%20cozy%20golden%20hour?width=400&height=300&nologo=true&seed=104'
    },
    {
      id: 5,
      title: 'Desert Pyramid',
      idea: 'Ancient pyramid with hidden chambers',
      style: 'medieval',
      biome: 'desert',
      mood: 'mystical',
      time: 'golden',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20desert%20pyramid%20ancient%20chambers%20desert%20biome%20mystical%20golden?width=400&height=300&nologo=true&seed=105'
    },
    {
      id: 6,
      title: 'Underwater Base',
      idea: 'Modern underwater research facility',
      style: 'modern',
      biome: 'ocean',
      mood: 'clean',
      time: 'night',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20underwater%20base%20modern%20research%20facility%20ocean%20biome%20clean%20night?width=400&height=300&nologo=true&seed=106'
    },
    {
      id: 7,
      title: 'Steampunk Airship',
      idea: 'Victorian flying ship with propellers',
      style: 'steampunk',
      biome: 'mountain',
      mood: 'epic',
      time: 'sunrise',
      scale: 'mega',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20steampunk%20airship%20victorian%20propellers%20mountain%20biome%20epic%20sunrise?width=400&height=300&nologo=true&seed=107'
    },
    {
      id: 8,
      title: 'Nether Fortress',
      idea: 'Dark fortress in the nether',
      style: 'gothic',
      biome: 'nether',
      mood: 'dark',
      time: 'night',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20nether%20fortress%20dark%20gothic%20nether%20biome%20dark%20night?width=400&height=300&nologo=true&seed=108'
    },
    {
      id: 9,
      title: 'Rustic Farm',
      idea: 'Cozy farmhouse with barn and animals',
      style: 'rustic',
      biome: 'plains',
      mood: 'cozy',
      time: 'golden',
      scale: 'small',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20rustic%20farmhouse%20barn%20animals%20plains%20biome%20cozy%20golden%20hour?width=400&height=300&nologo=true&seed=109'
    },
    {
      id: 10,
      title: 'Futuristic City',
      idea: 'Cyberpunk city with neon lights',
      style: 'futuristic',
      biome: 'plains',
      mood: 'epic',
      time: 'night',
      scale: 'mega',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20futuristic%20cyberpunk%20city%20neon%20lights%20plains%20biome%20epic%20night?width=400&height=300&nologo=true&seed=110'
    },
    {
      id: 11,
      title: 'Snow Castle',
      idea: 'Ice castle in frozen tundra',
      style: 'fantasy',
      biome: 'snow',
      mood: 'mystical',
      time: 'night',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20ice%20castle%20frozen%20tundra%20snow%20biome%20mystical%20night?width=400&height=300&nologo=true&seed=111'
    },
    {
      id: 12,
      title: 'End City Tower',
      idea: 'Floating end city with purple theme',
      style: 'fantasy',
      biome: 'end',
      mood: 'mystical',
      time: 'night',
      scale: 'large',
      image: 'https://image.pollinations.ai/prompt/Minecraft%20end%20city%20floating%20purple%20end%20biome%20mystical%20night?width=400&height=300&nologo=true&seed=112'
    }
  ];

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setConcept({
      ...preset,
      difficulty: 'Intermediate',
      palette: {},
      tips: [],
      prompts: {},
      images: {}
    });
    
    toast({
      title: "Preset Selected",
      description: `${preset.title} loaded successfully!`,
    });

    setTimeout(() => {
      onNavigate('generator');
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-xl p-6 border border-emerald-800/30">
        <h2 className="text-2xl font-bold text-white mb-2">Build Gallery</h2>
        <p className="text-emerald-300">
          Explore our curated collection of build presets. Select one to customize and generate your own version.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset) => (
          <Card 
            key={preset.id}
            className={`bg-black/40 border-emerald-800/30 backdrop-blur-sm hover-lift cursor-pointer transition-all ${
              selectedPreset === preset.id ? 'ring-2 ring-emerald-500' : ''
            }`}
            onClick={() => handleSelectPreset(preset)}
          >
            <div className="relative overflow-hidden rounded-t-lg h-48">
              <img 
                src={preset.image} 
                alt={preset.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/1f2937/10b981?text=Minecraft+Build';
                }}
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-600 text-white">
                  {preset.scale}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {preset.title}
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </CardTitle>
              <CardDescription className="text-stone-400">
                {preset.idea}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-emerald-700 text-emerald-400">
                  {preset.style}
                </Badge>
                <Badge variant="outline" className="border-amber-700 text-amber-400">
                  {preset.biome}
                </Badge>
                <Badge variant="outline" className="border-blue-700 text-blue-400">
                  {preset.mood}
                </Badge>
              </div>
              <Button 
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPreset(preset);
                }}
              >
                Use This Preset
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Gallery;