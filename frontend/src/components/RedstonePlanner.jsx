import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Loader2, Zap, Settings, Lightbulb } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const RedstonePlanner = () => {
  const { toast } = useToast();
  const [automationType, setAutomationType] = useState('door');
  const [complexity, setComplexity] = useState('basic');
  const [powerSource, setPowerSource] = useState('redstone');
  const [isPlanning, setIsPlanning] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGeneratePlan = async () => {
    setIsPlanning(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/redstone-planner";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automation_type: automationType,
          complexity: complexity,
          power_source: powerSource
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setPlan(data);

      toast({
        title: "Redstone Plan Generated!",
        description: `Designed ${data.design.automation_type} automation.`,
      });

    } catch (error) {
      console.error("Planning Error:", error);
      toast({
        title: "Planning Failed",
        description: "Could not generate redstone plan.",
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
            <Zap className="w-5 h-5 text-emerald-400" />
            Redstone Planner
          </CardTitle>
          <CardDescription className="text-stone-400">
            Design redstone mechanisms and automation systems for your build
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Automation Type */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Automation Type</label>
              <Select value={automationType} onValueChange={setAutomationType}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="door">Automatic Door</SelectItem>
                  <SelectItem value="farm">Auto Farm</SelectItem>
                  <SelectItem value="trap">Trap System</SelectItem>
                  <SelectItem value="elevator">Elevator</SelectItem>
                  <SelectItem value="storage">Auto Storage</SelectItem>
                  <SelectItem value="lighting">Smart Lighting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Complexity */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Complexity Level</label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic - Simple mechanism</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Moderate complexity</SelectItem>
                  <SelectItem value="advanced">Advanced - Complex system</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Power Source */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Power Source</label>
              <Select value={powerSource} onValueChange={setPowerSource}>
                <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="redstone">Redstone Dust</SelectItem>
                  <SelectItem value="observer">Observer</SelectItem>
                  <SelectItem value="lever">Lever/Button</SelectItem>
                  <SelectItem value="pressure">Pressure Plate</SelectItem>
                  <SelectItem value="tripwire">Tripwire</SelectItem>
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
                <Zap className="w-4 h-4 mr-2" />
                Generate Redstone Plan
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
              <Settings className="w-5 h-5 text-emerald-400" />
              Redstone Design Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Design Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{plan.estimated_cost}</div>
                <div className="text-stone-400 text-sm">Components Needed</div>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{plan.difficulty}</div>
                <div className="text-stone-400 text-sm">Difficulty Level</div>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{plan.design.power_source}</div>
                <div className="text-stone-400 text-sm">Power Source</div>
              </div>
            </div>

            {/* Components Required */}
            <div>
              <h3 className="text-white font-semibold mb-3">Required Components</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {plan.design.components?.map((component, index) => (
                  <div key={index} className="bg-stone-800/50 rounded-lg p-3 text-center">
                    <div className="text-emerald-300 font-medium text-sm">{component}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Design */}
            <div>
              <h3 className="text-white font-semibold mb-3">Circuit Layout</h3>
              <div className="bg-stone-800/30 rounded-lg p-4">
                <div className="bg-black/60 rounded p-3">
                  <code className="text-emerald-300 text-sm font-mono">
                    {plan.design.layout}
                  </code>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Building Tips
              </h3>
              <div className="space-y-2">
                {plan.tips?.map((tip, index) => (
                  <div key={index} className="bg-yellow-950/30 border border-yellow-800/30 rounded-lg p-3">
                    <p className="text-yellow-300 text-sm flex items-start gap-2">
                      <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Notes */}
            {complexity === 'advanced' && (
              <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-4">
                <h3 className="text-red-300 font-semibold mb-2">⚠️ Advanced Considerations</h3>
                <ul className="text-red-200 text-sm space-y-1">
                  <li>• Ensure proper signal timing to avoid circuit conflicts</li>
                  <li>• Test components individually before connecting</li>
                  <li>• Consider using redstone repeaters for long signal distances</li>
                  <li>• Plan for power consumption and signal strength</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RedstonePlanner;