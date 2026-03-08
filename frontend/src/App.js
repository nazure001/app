import React, { useMemo, useState } from 'react';
import './App.css';
import {
  Wand2,
  Trees,
  Mountain,
  Snowflake,
  Waves,
  Flame,
  Castle,
  Hammer,
  Palette,
  Ruler,
  Map,
  HardDriveDownload,
  CircuitBoard,
  Sparkles,
  ScrollText,
  Blocks,
  GalleryHorizontal,
  ClipboardList,
  Compass,
  Sword,
  Home,
  Pickaxe,
  Zap,
  CheckCircle2,
  Package,
  Layers3
} from 'lucide-react';

const BIOMES = [
  {
    id: 'forest',
    label: 'Forest',
    climate: 'Temperate',
    terrain: 'Rolling hills',
    materials: ['oak_planks', 'spruce_planks', 'moss', 'stone_bricks'],
    styles: ['Rustic', 'Medieval', 'Cottage'],
    risks: ['dense trees', 'mob ambush'],
    icon: Trees
  },
  {
    id: 'desert',
    label: 'Desert',
    climate: 'Hot & dry',
    terrain: 'Flat dunes',
    materials: ['sandstone', 'smooth_sandstone', 'terracotta', 'birch_planks'],
    styles: ['Palace', 'Temple', 'Market'],
    risks: ['low wood supply', 'wide open exposure'],
    icon: Compass
  },
  {
    id: 'ocean',
    label: 'Ocean',
    climate: 'Humid',
    terrain: 'Open water',
    materials: ['prismarine', 'dark_prismarine', 'quartz', 'glass'],
    styles: ['Harbor', 'Research Lab', 'Lighthouse'],
    risks: ['drowned', 'underwater logistics'],
    icon: Waves
  },
  {
    id: 'mountain',
    label: 'Mountain',
    climate: 'Cold wind',
    terrain: 'Steep cliffs',
    materials: ['stone', 'andesite', 'deepslate', 'spruce_planks'],
    styles: ['Fortress', 'Monastery', 'Watchtower'],
    risks: ['uneven terrain', 'vertical hauling'],
    icon: Mountain
  },
  {
    id: 'snow',
    label: 'Snow',
    climate: 'Frozen',
    terrain: 'Icy plains',
    materials: ['spruce_planks', 'packed_ice', 'snow_block', 'stone_bricks'],
    styles: ['Nordic Hall', 'Outpost', 'Frozen Shrine'],
    risks: ['visibility', 'hostile weather atmosphere'],
    icon: Snowflake
  },
  {
    id: 'nether',
    label: 'Nether',
    climate: 'Extreme',
    terrain: 'Caverns & lava',
    materials: ['blackstone', 'basalt', 'crimson_planks', 'nether_bricks'],
    styles: ['Citadel', 'Forge', 'Arena'],
    risks: ['lava', 'hostile mobs', 'dangerous traversing'],
    icon: Flame
  }
];

const STYLES = [
  { id: 'medieval', label: 'Medieval', silhouette: 'towered keeps, arches, buttresses' },
  { id: 'modern', label: 'Modern', silhouette: 'clean lines, glass walls, layered volumes' },
  { id: 'fantasy', label: 'Fantasy', silhouette: 'dramatic roofs, glowing accents, asymmetry' },
  { id: 'japanese', label: 'Japanese', silhouette: 'tiered roofs, symmetry, gardens' },
  { id: 'steampunk', label: 'Steampunk', silhouette: 'pipes, brass details, industrial stacks' },
  { id: 'futuristic', label: 'Futuristic', silhouette: 'sleek forms, lighting strips, bold curves' },
  { id: 'rustic', label: 'Rustic', silhouette: 'timber frames, cozy textures, practical roofs' },
  { id: 'gothic', label: 'Gothic', silhouette: 'spires, pointed arches, stained glass' }
];

const BUILD_TYPES = [
  'Survival Base',
  'Castle',
  'Wizard Tower',
  'Harbor Town',
  'Mega Farm Hub',
  'Redstone Workshop',
  'Mountain Fortress',
  'Village Upgrade',
  'PvP Arena',
  'Nether Citadel'
];

const GALLERY_ITEMS = [
  {
    title: 'Cliffside Bastion',
    biome: 'Mountain',
    style: 'Medieval',
    difficulty: 'Hard',
    size: '48 x 36 x 42',
    vibe: 'defensive stronghold with hanging bridges'
  },
  {
    title: 'Sunken Prismarine Hub',
    biome: 'Ocean',
    style: 'Futuristic',
    difficulty: 'Expert',
    size: '56 x 56 x 28',
    vibe: 'underwater command center with glowing tubes'
  },
  {
    title: 'Sakura Courtyard Estate',
    biome: 'Forest',
    style: 'Japanese',
    difficulty: 'Medium',
    size: '34 x 28 x 18',
    vibe: 'peaceful estate with layered roofing and gardens'
  },
  {
    title: 'Crimson Forge Citadel',
    biome: 'Nether',
    style: 'Steampunk',
    difficulty: 'Expert',
    size: '44 x 32 x 31',
    vibe: 'industrial forge city powered by lava channels'
  }
];

const BLOCK_LIBRARY = {
  Medieval: ['stone_bricks', 'cobblestone', 'oak_planks', 'spruce_logs', 'lantern', 'glass_pane'],
  Modern: ['smooth_quartz', 'white_concrete', 'glass', 'gray_concrete', 'sea_lantern', 'iron_trapdoor'],
  Fantasy: ['purpur_block', 'amethyst_block', 'warped_planks', 'glowstone', 'quartz_pillar', 'tinted_glass'],
  Japanese: ['spruce_planks', 'dark_oak_logs', 'white_concrete', 'paper_wall', 'lantern', 'stone'],
  Steampunk: ['copper_block', 'cut_copper', 'deepslate_tiles', 'dark_oak_planks', 'chains', 'smoker'],
  Futuristic: ['quartz', 'cyan_glass', 'sea_lantern', 'iron_block', 'light_gray_concrete', 'observer'],
  Rustic: ['oak_logs', 'spruce_planks', 'mossy_stone_bricks', 'barrel', 'campfire', 'fence'],
  Gothic: ['deepslate_bricks', 'blackstone', 'cracked_stone_bricks', 'red_stained_glass', 'chain', 'lantern']
};

const ROOM_PROGRAMS = {
  'Survival Base': ['storage', 'smelter', 'bedroom', 'crop room', 'enchanting'],
  Castle: ['gatehouse', 'great hall', 'keep', 'barracks', 'vault'],
  'Wizard Tower': ['alchemy floor', 'library', 'portal room', 'observatory', 'attic'],
  'Harbor Town': ['docks', 'market', 'warehouse', 'lighthouse', 'captain office'],
  'Mega Farm Hub': ['sorting core', 'crop ring', 'villager bay', 'bone meal plant', 'collection room'],
  'Redstone Workshop': ['prototype bay', 'test lane', 'item storage', 'power room', 'display hall'],
  'Mountain Fortress': ['wall ring', 'smithy', 'lookout', 'keep', 'mine entrance'],
  'Village Upgrade': ['plaza', 'houses', 'blacksmith', 'watchtower', 'fields'],
  'PvP Arena': ['spawn rooms', 'center ring', 'spectator deck', 'loot vault', 'scoreboard wall'],
  'Nether Citadel': ['lava gate', 'forge', 'bridge', 'throne', 'wart vault']
};

function titleCase(value) {
  return value
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function estimateDimensions(scale) {
  const presets = {
    compact: { width: 21, length: 17, height: 13 },
    medium: { width: 34, length: 28, height: 20 },
    large: { width: 48, length: 36, height: 28 },
    mega: { width: 72, length: 56, height: 36 }
  };
  return presets[scale] || presets.medium;
}

function calculateDifficulty({ size, biome, style, automationLevel }) {
  const sizeScore = { compact: 1, medium: 2, large: 3, mega: 4 }[size] || 2;
  const biomeScore = {
    forest: 1,
    desert: 1,
    ocean: 3,
    mountain: 2,
    snow: 2,
    nether: 4
  }[biome] || 2;
  const styleScore = {
    medieval: 2,
    modern: 2,
    fantasy: 3,
    japanese: 2,
    steampunk: 3,
    futuristic: 3,
    rustic: 1,
    gothic: 3
  }[style] || 2;

  const total = sizeScore + biomeScore + styleScore + automationLevel;
  if (total <= 5) return { label: 'Easy', score: total };
  if (total <= 8) return { label: 'Medium', score: total };
  if (total <= 11) return { label: 'Hard', score: total };
  return { label: 'Expert', score: total };
}

function buildPrompt(form, biomeMeta, styleMeta) {
  return [
    `${styleMeta.label} Minecraft ${form.buildType.toLowerCase()}`,
    `set in a ${biomeMeta.label.toLowerCase()} biome`,
    `featuring ${styleMeta.silhouette}`,
    `${form.goal.toLowerCase()} gameplay loop`,
    `size class ${form.size}`,
    `${form.redstoneFocus ? `with ${form.redstoneFocus.toLowerCase()} redstone automation` : 'with practical survival-friendly mechanics'}`,
    `${form.mood.toLowerCase()} atmosphere`,
    'high detail, block-accurate, cinematic lighting, minecraft concept art'
  ].join(', ');
}

function generateBlockPalette(form, biomeMeta, styleMeta) {
  const styleBlocks = BLOCK_LIBRARY[styleMeta.label] || [];
  const merged = [...styleBlocks, ...biomeMeta.materials];
  const unique = [...new Set(merged)];
  const dimensions = estimateDimensions(form.size);
  const footprint = dimensions.width * dimensions.length;
  return unique.map((block, index) => ({
    block,
    stackEstimate: Math.max(1, Math.round((footprint / 64) * (0.55 - index * 0.04))),
    role: index < 2 ? 'primary shell' : index < 4 ? 'secondary detail' : 'accent / utility'
  }));
}

function generateBlueprint(form, biomeMeta, styleMeta) {
  const dims = estimateDimensions(form.size);
  const program = ROOM_PROGRAMS[form.buildType] || ROOM_PROGRAMS['Survival Base'];
  const floors = form.size === 'mega' ? 4 : form.size === 'large' ? 3 : 2;
  const layers = [];
  for (let level = 1; level <= floors; level += 1) {
    const room = program[(level - 1) % program.length];
    layers.push({
      level,
      footprint: `${dims.width - (level - 1) * 4} x ${dims.length - (level - 1) * 3}`,
      height: level === floors ? 6 : 5,
      purpose: titleCase(room),
      notes: level === 1
        ? `Anchor the build into ${biomeMeta.terrain.toLowerCase()} terrain with sturdy ${biomeMeta.materials[0]} foundations.`
        : `Transition with ${styleMeta.label.toLowerCase()} detailing and window rhythm for level ${level}.`
    });
  }

  return {
    dimensions: dims,
    floors,
    program,
    layers,
    landmarks: [
      `Main facade aligned to ${form.orientation}`,
      `Signature silhouette: ${styleMeta.silhouette}`,
      `Biome adaptation: ${biomeMeta.risks.join(', ')}`
    ]
  };
}

function generateRedstone(form) {
  const depth = form.automationLevel;
  const systems = [
    {
      title: 'Item Sorting Backbone',
      complexity: depth >= 2 ? 'Medium' : 'Basic',
      parts: ['hoppers', 'comparators', 'repeaters', 'chests'],
      description: 'Routes loot, farming output, and smelter overflow into labeled storage.'
    },
    {
      title: 'Lighting & Door Control',
      complexity: depth >= 3 ? 'Advanced' : 'Medium',
      parts: ['redstone_lamps', 'daylight_sensors', 'sticky_pistons', 'observers'],
      description: 'Switches ambience, hidden entries, and emergency lockdown on one control bus.'
    },
    {
      title: 'Showpiece Mechanism',
      complexity: depth >= 4 ? 'Expert' : 'Advanced',
      parts: ['flying_machine', 'piston_tape', 'target_blocks', 'dispensers'],
      description: 'Adds a hero feature such as drawbridge, rotating map wall, or cargo lift.'
    }
  ];
  return systems.slice(0, clamp(depth, 1, 3));
}

function generateConcept(form) {
  const biomeMeta = BIOMES.find((item) => item.id === form.biome) || BIOMES[0];
  const styleMeta = STYLES.find((item) => item.id === form.style) || STYLES[0];
  const difficulty = calculateDifficulty({
    size: form.size,
    biome: form.biome,
    style: form.style,
    automationLevel: form.automationLevel
  });
  const prompt = buildPrompt(form, biomeMeta, styleMeta);
  const palette = generateBlockPalette(form, biomeMeta, styleMeta);
  const blueprint = generateBlueprint(form, biomeMeta, styleMeta);
  const redstone = generateRedstone(form);

  return {
    title: `${styleMeta.label} ${form.buildType}`,
    subtitle: `${biomeMeta.label} • ${difficulty.label} • ${form.size.toUpperCase()}`,
    prompt,
    difficulty,
    palette,
    blueprint,
    redstone,
    biomeMeta,
    styleMeta,
    summary: `${form.buildType} designed for ${form.goal.toLowerCase()} play in the ${biomeMeta.label.toLowerCase()} biome with a ${form.mood.toLowerCase()} mood.`,
    builderTips: [
      `Start with a ${palette[0].block.replace(/_/g, ' ')} foundation to lock the silhouette early.`,
      `Reserve 15% of your footprint for circulation and vertical access.`,
      `Batch craft detail blocks before roofing to avoid breaking build flow.`,
      `Prototype redstone modules outside the main build, then transplant them floor by floor.`
    ]
  };
}

function downloadTextFile(filename, content, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function SectionCard({ icon: Icon, title, eyebrow, children, rightSlot }) {
  return (
    <section className="rounded-2xl border border-emerald-800/30 bg-black/35 p-5 shadow-2xl backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
            <Icon className="h-5 w-5 text-emerald-300" />
          </div>
          <div>
            {eyebrow ? <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">{eyebrow}</p> : null}
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
        </div>
        {rightSlot}
      </div>
      {children}
    </section>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-emerald-300">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.15em]">{label}</span>
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState({
    buildType: 'Survival Base',
    biome: 'forest',
    style: 'medieval',
    size: 'medium',
    goal: 'Efficient long-term survival',
    mood: 'Warm adventurous',
    orientation: 'Sunrise / East',
    automationLevel: 2,
    redstoneFocus: 'item sorting + hidden door',
    customIdea: 'a base that feels cozy at ground level and impressive from far away'
  });

  const [concept, setConcept] = useState(() => generateConcept({
    buildType: 'Survival Base',
    biome: 'forest',
    style: 'medieval',
    size: 'medium',
    goal: 'Efficient long-term survival',
    mood: 'Warm adventurous',
    orientation: 'Sunrise / East',
    automationLevel: 2,
    redstoneFocus: 'item sorting + hidden door',
    customIdea: 'a base that feels cozy at ground level and impressive from far away'
  }));

  const biomeMeta = useMemo(
    () => BIOMES.find((item) => item.id === form.biome) || BIOMES[0],
    [form.biome]
  );
  const styleMeta = useMemo(
    () => STYLES.find((item) => item.id === form.style) || STYLES[0],
    [form.style]
  );

  const plannerInsights = useMemo(() => {
    const dimensions = estimateDimensions(form.size);
    const volume = dimensions.width * dimensions.length * dimensions.height;
    const buildTime = Math.round(volume / 180);
    return {
      dimensions,
      volume,
      buildTime,
      survivalReadiness: form.automationLevel >= 3 ? 'Automation heavy' : 'Survival first',
      terrainNote: `${biomeMeta.label} terrain demands adaptation for ${biomeMeta.risks[0]}.`
    };
  }, [form.size, form.automationLevel, biomeMeta]);

  const promptText = buildPrompt(form, biomeMeta, styleMeta);

  const handleGenerate = () => {
    setConcept(generateConcept(form));
  };

  const handleExportBlueprint = () => {
    const payload = {
      metadata: {
        app: 'Minecraft Builder Toolkit',
        type: 'blueprint-export',
        generatedAt: new Date().toISOString()
      },
      form,
      concept
    };
    downloadTextFile(
      `${concept.title.toLowerCase().replace(/\s+/g, '-')}-blueprint.json`,
      JSON.stringify(payload, null, 2)
    );
  };

  const handleExportSchematicPack = () => {
    const pack = {
      note: 'This pack is schematic-ready JSON. For true .schem binary export, connect an NBT writer such as prismarine-nbt on the backend.',
      dimensions: concept.blueprint.dimensions,
      palette: concept.palette,
      layers: concept.blueprint.layers,
      redstone: concept.redstone
    };
    downloadTextFile(
      `${concept.title.toLowerCase().replace(/\s+/g, '-')}-schematic-pack.json`,
      JSON.stringify(pack, null, 2)
    );
  };

  const topFeatures = [
    { icon: Wand2, label: 'AI Generator', desc: 'Prompt-driven build concept engine' },
    { icon: Map, label: 'Biome Planner', desc: 'Context-aware design adaptation' },
    { icon: Sword, label: 'Difficulty Analyzer', desc: 'Skill-fit build recommendation' },
    { icon: Palette, label: 'Block Palette', desc: 'Material prep with stack estimates' },
    { icon: Ruler, label: 'Size Calculator', desc: 'Footprint, volume, and phase planning' },
    { icon: ScrollText, label: 'Blueprint', desc: 'Floor-by-floor build program' },
    { icon: HardDriveDownload, label: 'Schematic Pack', desc: 'Export-ready build data' },
    { icon: CircuitBoard, label: 'Redstone Planner', desc: 'Mechanic module suggestions' },
    { icon: GalleryHorizontal, label: 'Gallery', desc: 'Curated inspiration board' },
    { icon: Sparkles, label: 'Prompt Builder', desc: 'Flexible prompt authoring workflow' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-stone-950 to-amber-950 text-white">
      <header className="border-b border-emerald-700/20 bg-black/30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg">
              <Castle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Upgrade Besar</p>
              <h1 className="text-2xl font-bold sm:text-3xl">Minecraft Builder Toolkit</h1>
              <p className="text-sm text-stone-300">Dari generator ide sederhana menjadi planning suite end-to-end.</p>
            </div>
          </div>
          <div className="hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-right md:block">
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Current Build</p>
            <p className="font-semibold text-white">{concept.title}</p>
            <p className="text-sm text-stone-300">{concept.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-emerald-700/20 bg-black/30 p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center gap-3">
              <Wand2 className="h-5 w-5 text-emerald-300" />
              <div>
                <h2 className="text-2xl font-semibold">Command Center</h2>
                <p className="text-sm text-stone-300">Atur konsep, biome, difficulty, blueprint, dan redstone dalam satu flow.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-stone-300">Build Type</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.buildType}
                  onChange={(e) => setForm({ ...form, buildType: e.target.value })}
                >
                  {BUILD_TYPES.map((item) => (
                    <option key={item} value={item} className="bg-stone-900">
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Style</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value })}
                >
                  {STYLES.map((item) => (
                    <option key={item.id} value={item.id} className="bg-stone-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Biome</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.biome}
                  onChange={(e) => setForm({ ...form, biome: e.target.value })}
                >
                  {BIOMES.map((item) => (
                    <option key={item.id} value={item.id} className="bg-stone-900">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Size Tier</span>
                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                >
                  {['compact', 'medium', 'large', 'mega'].map((item) => (
                    <option key={item} value={item} className="bg-stone-900">
                      {item.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-stone-300">Main Goal</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  placeholder="Efficient long-term survival"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm text-stone-300">Custom Idea</span>
                <textarea
                  className="min-h-[96px] w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.customIdea}
                  onChange={(e) => setForm({ ...form, customIdea: e.target.value })}
                  placeholder="Describe the fantasy or practical vibe you want."
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Mood</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Orientation</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.orientation}
                  onChange={(e) => setForm({ ...form, orientation: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Redstone Focus</span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 outline-none"
                  value={form.redstoneFocus}
                  onChange={(e) => setForm({ ...form, redstoneFocus: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm text-stone-300">Automation Level: {form.automationLevel}</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={form.automationLevel}
                  onChange={(e) => setForm({ ...form, automationLevel: Number(e.target.value) })}
                  className="w-full accent-emerald-400"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-emerald-400"
              >
                Generate Toolkit Plan
              </button>
              <button
                onClick={handleExportBlueprint}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10"
              >
                Export Blueprint JSON
              </button>
              <button
                onClick={handleExportSchematicPack}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-500/15"
              >
                Export Schematic Pack
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-amber-500/10 p-6">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-emerald-300">AI Prompt Builder</p>
              <h2 className="mb-3 text-2xl font-semibold">{concept.title}</h2>
              <p className="mb-4 text-sm text-stone-200">{concept.summary}</p>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-7 text-stone-200">
                {promptText}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatPill icon={Sword} label="Difficulty" value={`${concept.difficulty.label} (${concept.difficulty.score})`} />
              <StatPill icon={Ruler} label="Dimensions" value={`${plannerInsights.dimensions.width} x ${plannerInsights.dimensions.length} x ${plannerInsights.dimensions.height}`} />
              <StatPill icon={Layers3} label="Floors" value={concept.blueprint.floors} />
              <StatPill icon={Pickaxe} label="Build Time" value={`${plannerInsights.buildTime} in-game min`} />
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-emerald-300">Planner Highlights</p>
              <ul className="space-y-3 text-sm text-stone-200">
                <li>• {plannerInsights.terrainNote}</li>
                <li>• {plannerInsights.survivalReadiness}</li>
                <li>• Volume budget: {plannerInsights.volume.toLocaleString()} blocks</li>
                <li>• Best visual identity: {styleMeta.silhouette}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {topFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <h3 className="font-semibold">{feature.label}</h3>
                <p className="mt-2 text-sm text-stone-300">{feature.desc}</p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SectionCard icon={Map} title="Biome Build Planner" eyebrow="Planning System">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <biomeMeta.icon className="h-5 w-5 text-emerald-300" />
                    <h3 className="font-semibold">{biomeMeta.label}</h3>
                  </div>
                  <p className="text-sm text-stone-300">Climate: {biomeMeta.climate}</p>
                  <p className="text-sm text-stone-300">Terrain: {biomeMeta.terrain}</p>
                  <p className="mt-3 text-sm text-stone-300">Recommended styles: {biomeMeta.styles.join(', ')}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-2 text-sm font-semibold text-white">Adaptation Notes</p>
                  <ul className="space-y-2 text-sm text-stone-300">
                    {biomeMeta.risks.map((risk) => (
                      <li key={risk}>• Mitigate {risk} with layered access, lighting, and terrain shaping.</li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={ClipboardList} title="Blueprint Generator" eyebrow="Building Tools">
              <div className="grid gap-3">
                {concept.blueprint.layers.map((layer) => (
                  <div key={layer.level} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">Level {layer.level}: {layer.purpose}</h3>
                        <p className="text-sm text-stone-300">Footprint {layer.footprint} • Height {layer.height}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                        Phase {layer.level}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-stone-300">{layer.notes}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon={CircuitBoard} title="Redstone Planner" eyebrow="Advanced Tools">
              <div className="grid gap-3">
                {concept.redstone.map((system) => (
                  <div key={system.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-semibold">{system.title}</h3>
                      <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-amber-200">
                        {system.complexity}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-stone-300">{system.description}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-400">
                      {system.parts.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard icon={Sword} title="Difficulty Analyzer" eyebrow="Planning System">
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-stone-300">Recommended for players who can handle:</p>
                  <p className="mt-2 text-xl font-semibold">{concept.difficulty.label}</p>
                  <p className="mt-2 text-sm text-stone-300">
                    Score {concept.difficulty.score} combines size, biome danger, style complexity, and automation level.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
                  {concept.difficulty.label === 'Easy' && 'Great for starter bases, quick builds, and solo survival players.'}
                  {concept.difficulty.label === 'Medium' && 'Balanced challenge with some logistics and decorative planning.'}
                  {concept.difficulty.label === 'Hard' && 'Expect terrain shaping, material runs, and multi-phase execution.'}
                  {concept.difficulty.label === 'Expert' && 'Best for advanced builders who enjoy large automation and showcase projects.'}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={Palette}
              title="Block Palette Generator"
              eyebrow="Building Tools"
              rightSlot={
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-emerald-200">
                  {concept.palette.length} blocks
                </span>
              }
            >
              <div className="space-y-2">
                {concept.palette.map((entry) => (
                  <div key={entry.block} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
                    <div>
                      <p className="font-medium text-white">{titleCase(entry.block)}</p>
                      <p className="text-stone-400">{entry.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-200">{entry.stackEstimate} stacks</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard icon={Ruler} title="Build Size Calculator" eyebrow="Planning System">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
                  <p>Footprint: {plannerInsights.dimensions.width} × {plannerInsights.dimensions.length}</p>
                  <p>Height budget: {plannerInsights.dimensions.height} blocks</p>
                  <p>Estimated volume: {plannerInsights.volume.toLocaleString()} blocks</p>
                  <p>Orientation: {form.orientation}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
                  <p className="mb-2 font-semibold text-white">Spacing Recommendation</p>
                  Leave at least {Math.round(plannerInsights.dimensions.width * 0.35)} blocks of buffer around the build for paths, terraforming, and expansion modules.
                </div>
              </div>
            </SectionCard>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <SectionCard icon={GalleryHorizontal} title="Inspiration Gallery" eyebrow="Community System">
            <div className="grid gap-3">
              {GALLERY_ITEMS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-stone-300">
                      {item.difficulty}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-300">{item.biome} • {item.style} • {item.size}</p>
                  <p className="mt-3 text-sm text-stone-300">{item.vibe}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Package} title="Builder Output Summary" eyebrow="Generator System">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-sm font-semibold text-white">Generated Summary</p>
                <p className="text-sm leading-7 text-stone-300">{concept.summary}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-sm font-semibold text-white">Landmarks</p>
                <ul className="space-y-2 text-sm text-stone-300">
                  {concept.blueprint.landmarks.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-white">Builder Tips</p>
                <ul className="grid gap-2 text-sm text-stone-300 md:grid-cols-2">
                  {concept.builderTips.map((tip) => (
                    <li key={tip} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                      <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-300" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>
        </section>
      </main>

      <footer className="border-t border-emerald-700/20 bg-black/25">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-stone-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Toolkit mode aktif: AI Generator, Prompt Builder, Biome Planner, Difficulty Analyzer, Block Palette, Size Calculator, Blueprint, Schematic Pack, Redstone Planner, Gallery.</p>
          <p className="text-emerald-300">Ready for tahap v1 sampai v8.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
