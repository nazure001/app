import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, Layers, Package, Lightbulb, Download, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BlueprintPack = ({ concept }) => {
  const { toast } = useToast();

  if (!concept) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-16 h-16 text-stone-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Build Concept Selected</h3>
            <p className="text-stone-400 mb-6">
              Generate a build concept in the AI Generator first to view its blueprint.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExportBlueprint = () => {
    const blueprintData = {
      manifest: {
        title: concept.title,
        style: concept.style,
        biome: concept.biome,
        scale: concept.scale,
        difficulty: concept.difficulty,
        estimatedTime: getEstimatedTime(concept.scale, concept.difficulty)
      },
      layers: concept.layers,
      materials: concept.palette,
      tips: concept.tips,
      features: concept.features
    };

    const dataStr = JSON.stringify(blueprintData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blueprint-${concept.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Blueprint Exported",
      description: "Blueprint data saved successfully.",
    });
  };

  const getEstimatedTime = (scale, difficulty) => {
    const timeMap = {
      small: { Beginner: '1-2 hours', Intermediate: '2-3 hours', Advanced: '3-4 hours', Expert: '4-6 hours' },
      medium: { Beginner: '3-5 hours', Intermediate: '5-8 hours', Advanced: '8-12 hours', Expert: '12-16 hours' },
      large: { Beginner: '10-15 hours', Intermediate: '15-25 hours', Advanced: '25-40 hours', Expert: '40-60 hours' },
      mega: { Beginner: '40-60 hours', Intermediate: '60-100 hours', Advanced: '100-150 hours', Expert: '150+ hours' }
    };
    return timeMap[scale]?.[difficulty] || 'Variable';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6 border border-emerald-800/30">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              Blueprint Pack
            </h2>
            <p className="text-emerald-300">
              Detailed construction guide for {concept.title}
            </p>
          </div>
          <Button
            onClick={handleExportBlueprint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Project Manifest */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Project Manifest
          </CardTitle>
          <CardDescription className="text-stone-400">Build overview and specifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Project Name</h4>
              <p className="text-white font-medium">{concept.title}</p>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Build Idea</h4>
              <p className="text-white font-medium">{concept.idea}</p>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Style</h4>
              <Badge className="bg-emerald-600 capitalize">{concept.style}</Badge>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Biome</h4>
              <Badge className="bg-amber-600 capitalize">{concept.biome}</Badge>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Scale</h4>
              <Badge className="bg-blue-600 capitalize">{concept.scale}</Badge>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Difficulty</h4>
              <Badge className="bg-purple-600">{concept.difficulty}</Badge>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Mood</h4>
              <p className="text-white font-medium capitalize">{concept.mood}</p>
            </div>
            <div>
              <h4 className="text-sm text-stone-400 mb-1">Estimated Time</h4>
              <p className="text-white font-medium">{getEstimatedTime(concept.scale, concept.difficulty)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Construction Layers */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Construction Layers
          </CardTitle>
          <CardDescription className="text-stone-400">Step-by-step build process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {concept.layers?.map((layer, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-stone-900/50 rounded-lg border border-emerald-800/20 hover:border-emerald-700/40 transition-colors"
              >
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{layer}</h4>
                  <p className="text-stone-400 text-sm">Complete this layer before moving to the next</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Material Planner */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Material Planner
          </CardTitle>
          <CardDescription className="text-stone-400">Recommended block palette for this build</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Blocks */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-600 rounded"></span>
                Main Palette
              </h4>
              <div className="space-y-2">
                {concept.palette?.main?.map((block, index) => (
                  <div key={index} className="flex items-center gap-2 text-stone-300 text-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    {block}
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Blocks */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-600 rounded"></span>
                Accent Blocks
              </h4>
              <div className="space-y-2">
                {concept.palette?.accent?.map((block, index) => (
                  <div key={index} className="flex items-center gap-2 text-stone-300 text-sm">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    {block}
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Blocks */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded"></span>
                Detail Blocks
              </h4>
              <div className="space-y-2">
                {concept.palette?.detail?.map((block, index) => (
                  <div key={index} className="flex items-center gap-2 text-stone-300 text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {block}
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div>
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-600 rounded"></span>
                Lighting
              </h4>
              <div className="space-y-2">
                {concept.palette?.lighting?.map((block, index) => (
                  <div key={index} className="flex items-center gap-2 text-stone-300 text-sm">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    {block}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            Pro Tips for {concept.style} Style
          </CardTitle>
          <CardDescription className="text-stone-400">Expert advice for building in this style</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {concept.tips?.map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-600/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-3 h-3 text-emerald-400" />
                </div>
                <p className="text-stone-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      {concept.features && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Key Features to Include</CardTitle>
            <CardDescription className="text-stone-400">
              Characteristic elements of {concept.style} builds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {concept.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="border-emerald-700 text-emerald-400">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlueprintPack;