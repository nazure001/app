import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Loader2, Map, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BiomePlanner = () => {
  const { toast } = useToast();
  const [biome, setBiome] = useState('plains');
  const [buildType, setBuildType] = useState('house');
  const [scale, setScale] = useState('medium');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGeneratePlan = async () => {
    setIsPlanning(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/biome-planner";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          biome: biome,
          build_type: buildType,
          scale: scale
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setPlan(data);

      toast({
        title: "Biome Plan Generated!",
        description: `Optimized design for ${biome} biome.`,
      });

    } catch (error) {
      console.error("Planning Error:", error);
      toast({
        title: "Planning Failed",
        description: "Could not generate biome plan.",
        variant: "destructive"
      });
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-400" />
            Biome Build Planner
          </CardTitle>
          <CardDescription className="text-stone-400">
            Adapt your build design to fit perfectly with the biome environment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Biome Selection */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Biome</label>
              <Select value={biome} onValueChange={setBiome}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plains">Plains</SelectItem>
                  <SelectItem value="forest">Forest</SelectItem>
                  <SelectItem value="desert">Desert</SelectItem>
                  <SelectItem value="mountain">Mountain</SelectItem>
                  <SelectItem value="ocean">Ocean</SelectItem>
                  <SelectItem value="taiga">Taiga</SelectItem>
                  <SelectItem value="swamp">Swamp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Build Type */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Build Type</label>
              <Select value={buildType} onValueChange={setBuildType}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="castle">Castle</SelectItem>
                  <SelectItem value="tower">Tower</SelectItem>
                  <SelectItem value="farm">Farm</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="temple">Temple</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Scale</label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="massive">Massive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGeneratePlan}
            disabled={isPlanning}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPlanning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Planning...
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-2" />
                Generate Biome Plan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {plan && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Biome Adaptation Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Material Adaptations */}
              <div>
                <h3 className="text-white font-semibold mb-3">Recommended Materials</h3>
                <div className="space-y-2">
                  {plan.material_adaptations?.map((material, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Structural Features */}
              <div>
                <h3 className="text-white font-semibold mb-3">Structural Features</h3>
                <ul className="text-stone-300 space-y-1">
                  {plan.structural_features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Environmental Challenges */}
              <div>
                <h3 className="text-white font-semibold mb-3">Environmental Challenges</h3>
                <ul className="text-stone-300 space-y-1">
                  {plan.environmental_challenges?.map((challenge, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Biome Advantages */}
              <div>
                <h3 className="text-white font-semibold mb-3">Biome Advantages</h3>
                <ul className="text-stone-300 space-y-1">
                  {plan.biome_advantages?.map((advantage, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-white font-semibold mb-3">Recommended Modifications</h3>
              <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4">
                <ul className="text-stone-300 space-y-2">
                  {plan.recommended_modifications?.map((mod, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">{index + 1}.</span>
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiomePlanner;