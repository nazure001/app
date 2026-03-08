import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Loader2, Target, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const DifficultyAnalyzer = ({ concept }) => {
  const { toast } = useToast();
  const [playerSkill, setPlayerSkill] = useState('intermediate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!concept) {
      toast({
        title: "No Build Concept",
        description: "Please generate a build concept first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const BACKEND_URL = "https://nazure02-minecraft-db.hf.space/api/difficulty-analyzer";

      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          build_concept: concept,
          player_skill: playerSkill
        })
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);

      toast({
        title: "Difficulty Analyzed!",
        description: `Build rated as ${data.calculated_difficulty}.`,
      });

    } catch (error) {
      console.error("Analysis Error:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze build difficulty.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Section */}
      <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Difficulty Analyzer
          </CardTitle>
          <CardDescription className="text-stone-400">
            Analyze build complexity and get difficulty rating based on your skill level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player Skill Selection */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Your Skill Level</label>
            <Select value={playerSkill} onValueChange={setPlayerSkill}>
              <SelectTrigger className="bg-black/50 border-emerald-800/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - New to Minecraft building</SelectItem>
                <SelectItem value="intermediate">Intermediate - Some building experience</SelectItem>
                <SelectItem value="advanced">Advanced - Experienced builder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !concept}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Analyze Difficulty
              </>
            )}
          </Button>

          {!concept && (
            <p className="text-stone-400 text-sm text-center">
              Generate a build concept first to analyze its difficulty
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-400" />
              Difficulty Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Difficulty Rating */}
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold text-lg ${getDifficultyColor(analysis.calculated_difficulty)}`}>
                <Target className="w-5 h-5" />
                {analysis.calculated_difficulty}
              </div>
              <p className="text-stone-400 mt-2">Adjusted for {analysis.skill_level} skill level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Complexity Score */}
              <div className="bg-stone-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Complexity Score
                </h3>
                <div className="text-2xl font-bold text-amber-400">
                  {analysis.complexity_score}/10
                </div>
                <p className="text-stone-400 text-sm mt-1">
                  Higher score = More complex build
                </p>
              </div>

              {/* Estimated Time */}
              <div className="bg-stone-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Estimated Time
                </h3>
                <div className="text-2xl font-bold text-blue-400">
                  {analysis.estimated_time}
                </div>
                <p className="text-stone-400 text-sm mt-1">
                  Time to complete the build
                </p>
              </div>
            </div>

            {/* Recommended Tools */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                Recommended Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.recommended_tools?.map((tool, index) => (
                  <Badge key={index} variant="secondary" className="bg-emerald-900/50 text-emerald-300">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-white font-semibold mb-3">Key Challenges</h3>
              <div className="space-y-2">
                {analysis.challenges?.map((challenge, index) => (
                  <div key={index} className="bg-amber-950/30 border border-amber-800/30 rounded-lg p-3">
                    <p className="text-amber-300 text-sm">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DifficultyAnalyzer;