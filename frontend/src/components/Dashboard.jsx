import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Wand2, Image, Circle, TrendingUp, Sparkles, Zap } from 'lucide-react';

const Dashboard = ({ onNavigate, concept }) => {
  const quickActions = [
    {
      icon: Wand2,
      title: 'Generate Build',
      description: 'Create AI-powered build concepts',
      action: () => onNavigate('generator'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Image,
      title: 'Browse Gallery',
      description: 'Explore preset build ideas',
      action: () => onNavigate('gallery'),
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: Circle,
      title: 'Circle Tool',
      description: 'Generate perfect circles',
      action: () => onNavigate('circle'),
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const stats = [
    { label: 'Styles Available', value: '8', icon: Sparkles },
    { label: 'Biomes Supported', value: '9', icon: TrendingUp },
    { label: 'Build Presets', value: '12', icon: Zap }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="glass-effect rounded-xl p-8 border border-emerald-800/30">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Minecraft Build Generator</h2>
        <p className="text-emerald-300 text-lg">
          Generate amazing Minecraft build concepts with AI-powered tools and creative presets.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-black/40 border-emerald-800/30 backdrop-blur-sm hover-lift">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-stone-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index} 
                className="bg-black/40 border-emerald-800/30 backdrop-blur-sm hover-lift cursor-pointer"
                onClick={action.action}
              >
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{action.title}</CardTitle>
                  <CardDescription className="text-stone-400">{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Current Build */}
      {concept && (
        <Card className="bg-black/40 border-emerald-800/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Current Build</CardTitle>
            <CardDescription className="text-stone-400">Your latest generated concept</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-white">{concept.title}</h4>
                <p className="text-emerald-400 text-sm mt-1">
                  {concept.style} • {concept.biome} • {concept.scale}
                </p>
              </div>
              <Button 
                onClick={() => onNavigate('blueprint')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                View Blueprint
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="glass-effect rounded-xl p-8 border border-emerald-800/30">
        <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Wand2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">AI-Powered Generation</h4>
              <p className="text-stone-400 text-sm">Create unique build concepts with intelligent prompt generation</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Image className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Visual Previews</h4>
              <p className="text-stone-400 text-sm">Get 4 different views: cinematic, palette, angle, and blueprint</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Circle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Circle Tool</h4>
              <p className="text-stone-400 text-sm">Generate perfect circles for your builds with customizable radius</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Detailed Blueprints</h4>
              <p className="text-stone-400 text-sm">Get construction layers, material lists, and building tips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;