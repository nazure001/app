import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, PenTool, Copy, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const PromptBuilder = () => {
  const { toast } = useToast();
  const [userPrompt, setUserPrompt] = useState('');
  const [styleHints, setStyleHints] = useState('');
  const [biomeHints, setBiomeHints] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState(null);

  const handleBuildPrompt = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to enhance.",
        variant: "destructive"
      });
      return;
    }

    setIsBuilding(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/prompt-builder";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: userPrompt,
          style_hints: styleHints || null,
          biome_hints: biomeHints || null
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setEnhancedPrompt(data);

      toast({
        title: "Prompt Enhanced!",
        description: "Your prompt has been optimized for better AI generation.",
      });

    } catch (error) {
      console.error("Prompt Building Error:", error);
      toast({
        title: "Enhancement Failed",
        description: "Could not enhance your prompt.",
        variant: "destructive"
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleCopyPrompt = () => {
    if (enhancedPrompt?.enhanced_prompt) {
      navigator.clipboard.writeText(enhancedPrompt.enhanced_prompt);
      toast({
        title: "Copied!",
        description: "Enhanced prompt copied to clipboard.",
      });
    }
  };

  const handleReset = () => {
    setUserPrompt('');
    setStyleHints('');
    setBiomeHints('');
    setEnhancedPrompt(null);
    toast({
      title: "Reset Complete",
      description: "All fields have been cleared.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-400" />
            AI Prompt Builder
          </CardTitle>
          <CardDescription className="text-stone-400">
            Transform your simple ideas into detailed AI prompts for better build generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Prompt */}
          <div className="space-y-2">
            <Label htmlFor="userPrompt" className="text-white">Your Build Idea</Label>
            <Textarea
              id="userPrompt"
              placeholder="e.g., A cozy house with a garden"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="bg-black/50 border-emerald-800/30 text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Style Hints */}
            <div className="space-y-2">
              <Label htmlFor="styleHints" className="text-white">Style Hints (Optional)</Label>
              <Input
                id="styleHints"
                placeholder="e.g., medieval, modern, fantasy"
                value={styleHints}
                onChange={(e) => setStyleHints(e.target.value)}
                className="bg-black/50 border-emerald-800/30 text-white"
              />
            </div>

            {/* Biome Hints */}
            <div className="space-y-2">
              <Label htmlFor="biomeHints" className="text-white">Biome Hints (Optional)</Label>
              <Input
                id="biomeHints"
                placeholder="e.g., forest, desert, mountain"
                value={biomeHints}
                onChange={(e) => setBiomeHints(e.target.value)}
                className="bg-black/50 border-emerald-800/30 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleBuildPrompt}
              disabled={isBuilding}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isBuilding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Build AI Prompt
                </>
              )}
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              className="border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/50"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {enhancedPrompt && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Enhanced AI Prompt
            </CardTitle>
            <CardDescription className="text-stone-400">
              Optimized prompt ready for AI generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original vs Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Your Original Prompt</h3>
                <div className="bg-stone-800/50 rounded-lg p-4">
                  <p className="text-stone-300 text-sm">"{enhancedPrompt.original_prompt}"</p>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  Enhanced Prompt
                  <Button
                    onClick={handleCopyPrompt}
                    size="sm"
                    variant="outline"
                    className="border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/50"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </h3>
                <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4">
                  <p className="text-emerald-300 text-sm">"{enhancedPrompt.enhanced_prompt}"</p>
                </div>
              </div>
            </div>

            {/* Enhancements Applied */}
            <div>
              <h3 className="text-white font-semibold mb-3">Enhancements Applied</h3>
              <div className="flex flex-wrap gap-2">
                {enhancedPrompt.enhancements?.map((enhancement, index) => (
                  <Badge key={index} variant="secondary" className="bg-emerald-900/50 text-emerald-300">
                    {enhancement}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Context Information */}
            {(enhancedPrompt.style_hints || enhancedPrompt.biome_hints) && (
              <div>
                <h3 className="text-white font-semibold mb-3">Context Added</h3>
                <div className="space-y-2">
                  {enhancedPrompt.style_hints && (
                    <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>Style:</strong> {enhancedPrompt.style_hints}
                      </p>
                    </div>
                  )}
                  {enhancedPrompt.biome_hints && (
                    <div className="bg-green-950/30 border border-green-800/30 rounded-lg p-3">
                      <p className="text-green-300 text-sm">
                        <strong>Biome:</strong> {enhancedPrompt.biome_hints}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Usage Tips */}
            <div className="bg-stone-800/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">💡 Usage Tips</h3>
              <ul className="text-stone-300 text-sm space-y-1">
                <li>• Copy the enhanced prompt and use it in any AI image generator</li>
                <li>• The prompt includes technical terms for better Minecraft-specific results</li>
                <li>• Feel free to modify the enhanced prompt further if needed</li>
                <li>• For best results, use with DALL-E, Midjourney, or Stable Diffusion</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptBuilder;