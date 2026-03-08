import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Ruler, Calculator } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SizeCalculator = () => {
  const { toast } = useToast();
  const [buildType, setBuildType] = useState('house');
  const [scale, setScale] = useState('medium');
  const [floors, setFloors] = useState(1);
  const [wings, setWings] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculation, setCalculation] = useState(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/size-calculator";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          build_type: buildType,
          scale: scale,
          floors: floors,
          wings: wings
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setCalculation(data);

      toast({
        title: "Size Calculated!",
        description: `Dimensions calculated for ${data.build_type}.`,
      });

    } catch (error) {
      console.error("Calculation Error:", error);
      toast({
        title: "Calculation Failed",
        description: "Could not calculate build size.",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Ruler className="w-5 h-5 text-emerald-400" />
            Build Size Calculator
          </CardTitle>
          <CardDescription className="text-stone-400">
            Calculate optimal dimensions and resource requirements for your build
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Build Type */}
            <div className="space-y-2">
              <Label htmlFor="buildType" className="text-white">Build Type</Label>
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
              <Label htmlFor="scale" className="text-white">Scale</Label>
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

            {/* Floors */}
            <div className="space-y-2">
              <Label htmlFor="floors" className="text-white">Number of Floors</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                max="10"
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                className="bg-black/50 border-emerald-800/30 text-white"
              />
            </div>

            {/* Wings */}
            <div className="space-y-2">
              <Label htmlFor="wings" className="text-white">Number of Wings</Label>
              <Input
                id="wings"
                type="number"
                min="1"
                max="4"
                value={wings}
                onChange={(e) => setWings(parseInt(e.target.value) || 1)}
                className="bg-black/50 border-emerald-800/30 text-white"
              />
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Size
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {calculation && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Ruler className="w-5 h-5 text-emerald-400" />
              Size Calculation Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dimensions */}
            <div className="bg-stone-800/50 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 text-center">Build Dimensions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{calculation.dimensions.width}</div>
                  <div className="text-stone-400 text-sm">Width (blocks)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{calculation.dimensions.length}</div>
                  <div className="text-stone-400 text-sm">Length (blocks)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{calculation.dimensions.height}</div>
                  <div className="text-stone-400 text-sm">Height (blocks)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{calculation.dimensions.floors}</div>
                  <div className="text-stone-400 text-sm">Floors</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Volume & Area</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-stone-300">Volume:</span>
                    <span className="text-emerald-400 font-semibold">{calculation.metrics.volume_blocks.toLocaleString()} blocks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-300">Surface Area:</span>
                    <span className="text-blue-400 font-semibold">{calculation.metrics.surface_area.toLocaleString()} blocks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-300">Chunk Coverage:</span>
                    <span className="text-purple-400 font-semibold">{calculation.metrics.chunk_area}</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Time Estimate</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-stone-300">Build Time:</span>
                    <span className="text-yellow-400 font-semibold">{calculation.metrics.estimated_time}</span>
                  </div>
                  <div className="text-stone-400 text-sm mt-2">
                    This is a rough estimate based on average building speed.
                    Actual time may vary based on your experience and building style.
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Planning Recommendations</h3>
              <ul className="text-stone-300 space-y-2">
                <li>• Consider building in {calculation.metrics.chunk_area} for optimal performance</li>
                <li>• Plan for {Math.ceil(calculation.dimensions.width / 16)} x {Math.ceil(calculation.dimensions.length / 16)} chunk area</li>
                <li>• Allow extra space for decorative elements and landscaping</li>
                <li>• Consider structural integrity for {calculation.dimensions.height} block height</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SizeCalculator;