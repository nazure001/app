import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Loader2, Blocks, ShoppingCart, Download } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BlockPalette = ({ concept }) => {
  const { toast } = useToast();
  const [includeRedstone, setIncludeRedstone] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [palette, setPalette] = useState(null);

  const handleGeneratePalette = async () => {
    if (!concept) {
      toast({
        title: "No Build Concept",
        description: "Please generate a build concept first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/block-palette";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          build_concept: concept,
          include_redstone: includeRedstone
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setPalette(data);

      toast({
        title: "Block Palette Generated!",
        description: `Prepared materials for ${data.build_title}.`,
      });

    } catch (error) {
      console.error("Palette Error:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate block palette.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportShoppingList = () => {
    if (!palette) return;

    const shoppingList = palette.shopping_list?.join('\n') || '';
    const dataBlob = new Blob([shoppingList], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${palette.build_title.replace(/\s+/g, '-').toLowerCase()}-shopping-list.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Shopping List Exported!",
      description: "Download your material shopping list.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Blocks className="w-5 h-5 text-emerald-400" />
            Block Palette Generator
          </CardTitle>
          <CardDescription className="text-stone-400">
            Generate a complete list of blocks and materials needed for your build
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Redstone Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="redstone"
              checked={includeRedstone}
              onCheckedChange={setIncludeRedstone}
              className="border-emerald-800/30"
            />
            <label htmlFor="redstone" className="text-white text-sm">
              Include redstone components for automation
            </label>
          </div>

          <Button
            onClick={handleGeneratePalette}
            disabled={isGenerating || !concept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Blocks className="w-4 h-4 mr-2" />
                Generate Block Palette
              </>
            )}
          </Button>

          {!concept && (
            <p className="text-stone-400 text-sm text-center">
              Generate a build concept first to create a block palette
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {palette && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              Material Requirements
            </CardTitle>
            <CardDescription className="text-stone-400">
              Complete block palette for {palette.build_title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{palette.total_blocks}</div>
                <div className="text-stone-400 text-sm">Total Blocks</div>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{Object.keys(palette.palette || {}).length}</div>
                <div className="text-stone-400 text-sm">Categories</div>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <Button
                  onClick={handleExportShoppingList}
                  variant="outline"
                  size="sm"
                  className="border-emerald-800/30 text-emerald-300 hover:bg-emerald-900/50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>

            {/* Block Categories */}
            <div className="space-y-4">
              {Object.entries(palette.palette || {}).map(([category, blocks]) => (
                <div key={category} className="bg-stone-800/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 capitalize flex items-center gap-2">
                    <Blocks className="w-4 h-4 text-emerald-400" />
                    {category} Blocks
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {blocks.map((block, index) => (
                      <div key={index} className="bg-black/40 rounded-lg p-3 border border-stone-700/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium text-sm">{block.block}</span>
                          <Badge variant="secondary" className="text-xs">
                            {block.quantity}
                          </Badge>
                        </div>
                        <div className="text-stone-400 text-xs">
                          Source: {block.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Shopping List Preview */}
            <div className="bg-stone-800/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Quick Shopping List</h3>
              <div className="bg-black/60 rounded p-3 max-h-32 overflow-y-auto">
                <div className="text-stone-300 text-sm font-mono">
                  {palette.shopping_list?.slice(0, 20).join(', ')}
                  {palette.shopping_list && palette.shopping_list.length > 20 && '...'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BlockPalette;