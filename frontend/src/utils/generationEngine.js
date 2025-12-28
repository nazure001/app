// Minecraft Build Generation Engine
// Rule-based system for generating creative build concepts

export const STYLE_KEYWORDS = {
  medieval: ['castle', 'fortress', 'kingdom', 'tower', 'keep', 'village', 'cathedral'],
  modern: ['skyscraper', 'house', 'city', 'apartment', 'glass', 'contemporary'],
  fantasy: ['magical', 'enchanted', 'mystical', 'wizard', 'dragon', 'realm'],
  japanese: ['temple', 'pagoda', 'shrine', 'zen', 'garden', 'dojo'],
  steampunk: ['industrial', 'mechanical', 'airship', 'clockwork', 'factory'],
  futuristic: ['sci-fi', 'neon', 'cyberpunk', 'space', 'tech', 'holographic'],
  rustic: ['farmhouse', 'barn', 'cottage', 'cabin', 'windmill'],
  gothic: ['cathedral', 'dark', 'spire', 'gargoyle', 'mansion']
};

export const BIOME_KEYWORDS = {
  forest: ['trees', 'woodland', 'grove', 'canopy', 'nature'],
  desert: ['sand', 'dunes', 'oasis', 'pyramid', 'canyon'],
  ocean: ['underwater', 'coral', 'reef', 'ship', 'lighthouse'],
  mountain: ['peak', 'cliff', 'alpine', 'highland', 'summit'],
  snow: ['ice', 'frozen', 'winter', 'igloo', 'tundra'],
  plains: ['grassland', 'meadow', 'field', 'open', 'ranch'],
  taiga: ['pine', 'spruce', 'northern', 'cabin', 'cold'],
  nether: ['hell', 'lava', 'fortress', 'crimson', 'warped'],
  end: ['void', 'floating', 'end city', 'purple', 'ethereal']
};

export const BIOME_PALETTES = {
  forest: {
    main: ['Oak Wood', 'Spruce Wood', 'Dark Oak', 'Stone Brick'],
    accent: ['Moss Block', 'Vines', 'Leaves', 'Grass Block'],
    detail: ['Lanterns', 'Campfire', 'Flowers', 'Mushrooms'],
    lighting: ['Torches', 'Lanterns', 'Glowstone']
  },
  desert: {
    main: ['Sandstone', 'Smooth Sandstone', 'Terracotta', 'Red Sand'],
    accent: ['Chiseled Sandstone', 'Cut Sandstone', 'Orange Terracotta'],
    detail: ['Dead Bush', 'Cactus', 'Gold Blocks', 'Yellow Concrete'],
    lighting: ['Torches', 'Lanterns', 'Glowstone']
  },
  ocean: {
    main: ['Prismarine', 'Dark Prismarine', 'Stone Brick', 'Cyan Terracotta'],
    accent: ['Sea Lanterns', 'Prismarine Bricks', 'Coral Blocks'],
    detail: ['Kelp', 'Sea Pickles', 'Conduit', 'Glass'],
    lighting: ['Sea Lanterns', 'Glowstone', 'Torches']
  },
  mountain: {
    main: ['Stone', 'Andesite', 'Cobblestone', 'Stone Brick'],
    accent: ['Polished Andesite', 'Diorite', 'Gravel'],
    detail: ['Snow', 'Ice', 'Iron Bars', 'Chains'],
    lighting: ['Torches', 'Lanterns', 'Campfire']
  },
  snow: {
    main: ['Snow Block', 'Packed Ice', 'White Concrete', 'Quartz'],
    accent: ['Blue Ice', 'Light Blue Concrete', 'Ice'],
    detail: ['Powder Snow', 'Snowballs', 'Frost Walker Ice'],
    lighting: ['Torches', 'Lanterns', 'Glowstone', 'Sea Lanterns']
  },
  plains: {
    main: ['Oak Wood', 'Cobblestone', 'Stone Brick', 'Dirt'],
    accent: ['Hay Bales', 'Wheat', 'Grass Block', 'Flowers'],
    detail: ['Fences', 'Gates', 'Paths', 'Campfire'],
    lighting: ['Torches', 'Lanterns', 'Campfire']
  },
  taiga: {
    main: ['Spruce Wood', 'Stone', 'Cobblestone', 'Dark Oak'],
    accent: ['Podzol', 'Coarse Dirt', 'Snow', 'Spruce Leaves'],
    detail: ['Ferns', 'Sweet Berries', 'Campfire', 'Snow Layer'],
    lighting: ['Torches', 'Campfire', 'Lanterns']
  },
  nether: {
    main: ['Nether Brick', 'Blackstone', 'Crimson Planks', 'Basalt'],
    accent: ['Crimson Stems', 'Warped Stems', 'Nether Wart Blocks'],
    detail: ['Soul Fire', 'Lava', 'Magma Blocks', 'Chains'],
    lighting: ['Soul Lanterns', 'Magma Blocks', 'Lava', 'Glowstone']
  },
  end: {
    main: ['End Stone', 'End Stone Brick', 'Purpur Block', 'Obsidian'],
    accent: ['Purpur Pillar', 'Chorus Plant', 'Shulker Box'],
    detail: ['End Rods', 'Dragon Head', 'Purple Glass', 'Chorus Fruit'],
    lighting: ['End Rods', 'Torches', 'Glowstone']
  }
};

export const STYLE_TOUCHES = {
  medieval: {
    tips: [
      'Use varied stone textures for realistic weathering',
      'Add wooden support beams for structural detail',
      'Include towers at corners for defense aesthetics',
      'Use cobblestone and stone brick combinations'
    ],
    features: ['Battlements', 'Arrow Slits', 'Drawbridge', 'Moat', 'Banners']
  },
  modern: {
    tips: [
      'Use clean lines and geometric shapes',
      'Incorporate lots of glass for natural lighting',
      'Use concrete and quartz for sleek surfaces',
      'Add minimalist landscaping'
    ],
    features: ['Large Windows', 'Flat Roof', 'Pool', 'Terrace', 'Garage']
  },
  fantasy: {
    tips: [
      'Use unusual shapes and asymmetry',
      'Add magical elements like portals or crystals',
      'Incorporate glowing blocks for mystical ambiance',
      'Mix natural and unnatural block combinations'
    ],
    features: ['Spires', 'Floating Elements', 'Runes', 'Crystals', 'Magic Circles']
  },
  japanese: {
    tips: [
      'Use sloped roofs with overhanging eaves',
      'Incorporate gardens and water features',
      'Use paper-like textures for walls',
      'Add zen elements for tranquility'
    ],
    features: ['Torii Gates', 'Stone Lanterns', 'Koi Pond', 'Cherry Blossoms', 'Bamboo']
  },
  steampunk: {
    tips: [
      'Use copper, iron, and brass-colored blocks',
      'Add gears, pipes, and mechanical details',
      'Incorporate industrial lighting',
      'Mix Victorian architecture with tech'
    ],
    features: ['Gears', 'Pipes', 'Smokestacks', 'Boilers', 'Clockwork']
  },
  futuristic: {
    tips: [
      'Use smooth, sleek materials like concrete',
      'Incorporate neon and glowing elements',
      'Add holographic-looking details',
      'Use unconventional shapes'
    ],
    features: ['Neon Lights', 'Glass Panels', 'Tech Panels', 'Holograms', 'Landing Pads']
  },
  rustic: {
    tips: [
      'Use natural wood tones and textures',
      'Add weathered and aged details',
      'Incorporate gardens and farms',
      'Keep it simple and functional'
    ],
    features: ['Porch', 'Chimney', 'Garden', 'Well', 'Fence']
  },
  gothic: {
    tips: [
      'Use tall, pointed arches',
      'Add dramatic lighting and shadows',
      'Incorporate stained glass windows',
      'Use dark stone and wood'
    ],
    features: ['Spires', 'Gargoyles', 'Stained Glass', 'Crypts', 'Bell Tower']
  }
};

// Detect style from input text
export const detectStyle = (input) => {
  const lowerInput = input.toLowerCase();
  let bestMatch = 'medieval';
  let maxMatches = 0;

  Object.entries(STYLE_KEYWORDS).forEach(([style, keywords]) => {
    const matches = keywords.filter(keyword => lowerInput.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = style;
    }
  });

  return bestMatch;
};

// Detect biome from input text
export const detectBiome = (input) => {
  const lowerInput = input.toLowerCase();
  let bestMatch = 'plains';
  let maxMatches = 0;

  Object.entries(BIOME_KEYWORDS).forEach(([biome, keywords]) => {
    const matches = keywords.filter(keyword => lowerInput.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = biome;
    }
  });

  return bestMatch;
};

// Generate a creative title
export const generateTitle = (idea, style, biome) => {
  const prefixes = {
    medieval: ['Grand', 'Royal', 'Ancient', 'Majestic', 'Fortified'],
    modern: ['Contemporary', 'Sleek', 'Urban', 'Minimalist', 'Stylish'],
    fantasy: ['Enchanted', 'Mystical', 'Magical', 'Ethereal', 'Legendary'],
    japanese: ['Zen', 'Sacred', 'Tranquil', 'Traditional', 'Serene'],
    steampunk: ['Industrial', 'Mechanical', 'Victorian', 'Clockwork', 'Steam-Powered'],
    futuristic: ['Neo', 'Cyber', 'Quantum', 'Ultra-Modern', 'Tech'],
    rustic: ['Cozy', 'Humble', 'Rustic', 'Pastoral', 'Country'],
    gothic: ['Dark', 'Mysterious', 'Shadowy', 'Haunting', 'Gothic']
  };

  const biomeSuffixes = {
    forest: 'of the Woodland',
    desert: 'of the Dunes',
    ocean: 'of the Depths',
    mountain: 'of the Peaks',
    snow: 'of the Frozen North',
    plains: 'of the Grasslands',
    taiga: 'of the Pines',
    nether: 'of the Underworld',
    end: 'of the Void'
  };

  const prefix = prefixes[style][Math.floor(Math.random() * prefixes[style].length)];
  const suffix = biomeSuffixes[biome];
  const mainWord = idea.split(' ')[0] || 'Structure';
  
  return `${prefix} ${mainWord.charAt(0).toUpperCase() + mainWord.slice(1)} ${suffix}`;
};

// Generate difficulty rating
export const calculateDifficulty = (scale, style) => {
  const scaleValues = { small: 1, medium: 2, large: 3, mega: 4 };
  const styleComplexity = {
    medieval: 2,
    modern: 1,
    fantasy: 3,
    japanese: 3,
    steampunk: 4,
    futuristic: 3,
    rustic: 1,
    gothic: 3
  };

  const total = scaleValues[scale] + styleComplexity[style];
  if (total <= 3) return 'Beginner';
  if (total <= 5) return 'Intermediate';
  if (total <= 7) return 'Advanced';
  return 'Expert';
};

// Generate construction layers
export const generateLayers = (style, scale) => {
  const baseLayersMap = {
    small: ['Foundation', 'Walls', 'Roof', 'Details'],
    medium: ['Foundation', 'Ground Floor', 'Upper Floor', 'Roof', 'Exterior Details', 'Interior'],
    large: ['Foundation', 'Basement', 'Ground Floor', 'Floor 2', 'Floor 3', 'Roof', 'Towers', 'Details'],
    mega: ['Foundation', 'Underground', 'Ground Floor', 'Mid Floors', 'Upper Floors', 'Roof', 'Spires', 'Landscaping', 'Interior']
  };

  return baseLayersMap[scale] || baseLayersMap.medium;
};

// Generate image prompt for pollinations.ai
export const generateImagePrompt = (concept, viewType) => {
  const { idea, style, biome, mood, time } = concept;
  
  const basePrompt = `Minecraft ${style} style ${idea} in ${biome} biome`;
  
  const viewPrompts = {
    cinematic: `${basePrompt}, cinematic angle, dramatic ${time} lighting, ${mood} atmosphere, detailed blocks, high quality render`,
    palette: `${basePrompt}, block palette showcase, material breakdown, organized grid layout, color swatches`,
    angle: `${basePrompt}, isometric view, detailed construction, ${time} lighting, clear block details`,
    blueprint: `${basePrompt}, top-down schematic view, layer breakdown, architectural blueprint style, grid overlay`
  };

  return viewPrompts[viewType] || viewPrompts.cinematic;
};

// Generate pollinations.ai image URL
export const generateImageURL = (prompt, seed = null) => {
  const encodedPrompt = encodeURIComponent(prompt);
  const randomSeed = seed || Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&seed=${randomSeed}&nologo=true`;
};