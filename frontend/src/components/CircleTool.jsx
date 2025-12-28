import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Download, Circle as CircleIcon } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CircleTool = ({ circleConfig, setCircleConfig }) => {
  const { toast } = useToast();
  const canvasRef = useRef(null);

  const drawCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { radius, mode } = circleConfig;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- MULAI PERBAIKAN AUTO-ZOOM ---
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Hitung diameter lingkaran (ditambah padding 4 blok biar gak mepet pinggir)
    const diameterBlocks = (radius * 2) + 1 + 4; 
    
    // Hitung ukuran blok agar pas di canvas 600px
    // Math.floor agar garisnya tajam (pixel perfect)
    let blockSize = Math.floor(canvas.width / diameterBlocks);
    
    // Batasi ukuran blok:
    // Minimal 2px (biar radius 50 masih kelihatan)
    // Maksimal 40px (biar radius 1 gak kegedean banget)
    blockSize = Math.max(2, Math.min(40, blockSize));
    // --- SELESAI PERBAIKAN ---

    const pixelRadius = radius * blockSize;

    // Draw grid background (Logika Grid juga harus disesuaikan biar rapi)
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    
    // Grid dimulai dari tengah biar simetris saat di-zoom
    // Grid Vertikal
    for (let x = centerX; x <= canvas.width; x += blockSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let x = centerX; x >= 0; x -= blockSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    
    // Grid Horizontal
    for (let y = centerY; y <= canvas.height; y += blockSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let y = centerY; y >= 0; y -= blockSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Draw circle blocks
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1;

    const drawBlock = (x, y) => {
      const pixelX = centerX + x * blockSize - blockSize / 2;
      const pixelY = centerY + y * blockSize - blockSize / 2;
      ctx.fillRect(pixelX, pixelY, blockSize, blockSize);
      ctx.strokeRect(pixelX, pixelY, blockSize, blockSize);
    };

    // Midpoint circle algorithm
    const plotCirclePoints = (xc, yc, x, y, filled) => {
      if (filled) {
        // Fill the circle
        for (let i = -x; i <= x; i++) {
          drawBlock(i, y);
          drawBlock(i, -y);
        }
        for (let i = -y; i <= y; i++) {
          drawBlock(i, x);
          drawBlock(i, -x);
        }
      } else {
        // Draw outline only
        drawBlock(x, y);
        drawBlock(-x, y);
        drawBlock(x, -y);
        drawBlock(-x, -y);
        drawBlock(y, x);
        drawBlock(-y, x);
        drawBlock(y, -x);
        drawBlock(-y, -x);
      }
    };

    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    plotCirclePoints(0, 0, x, y, mode === 'filled');

    while (y >= x) {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      plotCirclePoints(0, 0, x, y, mode === 'filled');
    }

    // Draw center point
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(centerX - blockSize / 2, centerY - blockSize / 2, blockSize, blockSize);
    ctx.strokeStyle = '#dc2626';
    ctx.strokeRect(centerX - blockSize / 2, centerY - blockSize / 2, blockSize, blockSize);
  };

  useEffect(() => {
    drawCircle();
  }, [circleConfig]);

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `minecraft-circle-r${circleConfig.radius}-${circleConfig.mode}.png`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Circle template saved as PNG.",
      });
    });
  };

  const handleDownloadJSON = () => {
    const data = {
      ...circleConfig,
      blocks: calculateBlockPositions()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `minecraft-circle-r${circleConfig.radius}-${circleConfig.mode}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Circle data exported as JSON.",
    });
  };

  const calculateBlockPositions = () => {
    const { radius, mode } = circleConfig;
    const positions = [];

    const addPosition = (x, y) => {
      if (!positions.some(p => p.x === x && p.y === y)) {
        positions.push({ x, y, z: 0 });
      }
    };

    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    const plotCirclePoints = (x, y, filled) => {
      if (filled) {
        for (let i = -x; i <= x; i++) {
          addPosition(i, y);
          addPosition(i, -y);
        }
        for (let i = -y; i <= y; i++) {
          addPosition(i, x);
          addPosition(i, -x);
        }
      } else {
        addPosition(x, y);
        addPosition(-x, y);
        addPosition(x, -y);
        addPosition(-x, -y);
        addPosition(y, x);
        addPosition(-y, x);
        addPosition(y, -x);
        addPosition(-y, -x);
      }
    };

    plotCirclePoints(x, y, mode === 'filled');

    while (y >= x) {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      plotCirclePoints(x, y, mode === 'filled');
    }

    return positions;
  };

  const blockCount = calculateBlockPositions().length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-effect rounded-xl p-6 border border-emerald-800/30">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <CircleIcon className="w-6 h-6 text-emerald-400" />
          Circle Tool
        </h2>
        <p className="text-emerald-300">
          Generate perfect circles for your Minecraft builds. Adjust radius and mode, then download the template.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Configuration</CardTitle>
            <CardDescription className="text-stone-400">
              Customize your circle parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Radius */}
            <div className="space-y-3">
              <Label htmlFor="radius" className="text-white">
                Radius: {circleConfig.radius} blocks
              </Label>
              <Input
                id="radius"
                type="range"
                min="1"
                max="50"
                value={circleConfig.radius}
                onChange={(e) => setCircleConfig({ ...circleConfig, radius: parseInt(e.target.value) })}
                className="bg-black/30 border-emerald-800/50"
              />
              <Input
                type="number"
                min="1"
                max="50"
                value={circleConfig.radius}
                onChange={(e) => setCircleConfig({ ...circleConfig, radius: parseInt(e.target.value) || 1 })}
                className="bg-black/30 border-emerald-800/50 text-white"
              />
            </div>

            {/* Mode */}
            <div className="space-y-2">
              <Label htmlFor="mode" className="text-white">Mode</Label>
              <Select 
                value={circleConfig.mode} 
                onValueChange={(value) => setCircleConfig({ ...circleConfig, mode: value })}
              >
                <SelectTrigger className="bg-black/30 border-emerald-800/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-900 border-emerald-800/50">
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="space-y-2 p-4 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Radius:</span>
                <span className="text-white font-medium">{circleConfig.radius} blocks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Diameter:</span>
                <span className="text-white font-medium">{circleConfig.radius * 2 + 1} blocks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Total Blocks:</span>
                <span className="text-white font-medium">{blockCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Mode:</span>
                <span className="text-white font-medium capitalize">{circleConfig.mode}</span>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleDownloadPNG}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button
                onClick={handleDownloadJSON}
                variant="outline"
                className="w-full border-emerald-700 text-emerald-400 hover:bg-emerald-900/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Canvas Preview */}
        <Card className="lg:col-span-2 bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Circle Preview</CardTitle>
            <CardDescription className="text-stone-400">
              Visual representation of your circle (red = center)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-stone-950 rounded-lg p-4 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="border border-emerald-800/30 rounded"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">1. Configure</h4>
              <p className="text-stone-400">
                Set your desired radius and choose between outline or filled mode.
              </p>
            </div>
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">2. Preview</h4>
              <p className="text-stone-400">
                View the circle in real-time on the canvas. Each square represents one block.
              </p>
            </div>
            <div>
              <h4 className="text-emerald-400 font-medium mb-2">3. Export</h4>
              <p className="text-stone-400">
                Download as PNG for reference or JSON for precise block coordinates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircleTool;
