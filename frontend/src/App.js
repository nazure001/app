import React, { useState } from 'react';
import './App.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Home, Image, Wand2, Circle, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';
import AIGenerator from './components/AIGenerator';
import CircleTool from './components/CircleTool';
import BlueprintPack from './components/BlueprintPack';
import { Toaster } from './components/ui/toaster';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [concept, setConcept] = useState(null);
  const [circleConfig, setCircleConfig] = useState({ radius: 5, mode: 'outline' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950">
      <Toaster />
      
      {/* Header */}
      <header className="border-b border-emerald-800/30 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Minecraft Build Generator</h1>
                <p className="text-sm text-emerald-300">AI-Powered Build Concepts & Tools</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/30 backdrop-blur-sm border border-emerald-800/30 p-1 mb-8">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gallery" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger 
              value="generator" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Wand2 className="w-4 h-4" />
              <span className="hidden sm:inline">AI Generator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="circle" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <Circle className="w-4 h-4" />
              <span className="hidden sm:inline">Circle Tool</span>
            </TabsTrigger>
            <TabsTrigger 
              value="blueprint" 
              className="flex items-center space-x-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blueprint</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard onNavigate={setActiveTab} concept={concept} />
          </TabsContent>

          <TabsContent value="gallery">
            <Gallery onNavigate={setActiveTab} setConcept={setConcept} />
          </TabsContent>

          <TabsContent value="generator">
            <AIGenerator concept={concept} setConcept={setConcept} />
          </TabsContent>

          <TabsContent value="circle">
            <CircleTool circleConfig={circleConfig} setCircleConfig={setCircleConfig} />
          </TabsContent>

          <TabsContent value="blueprint">
            <BlueprintPack concept={concept} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-800/30 bg-black/20 backdrop-blur-md mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-emerald-300 text-sm">
            Free Minecraft Build Generator for the Community
          </p>
          <p className="text-stone-500 text-xs mt-2">
            Build amazing structures with AI-powered concepts and tools
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;