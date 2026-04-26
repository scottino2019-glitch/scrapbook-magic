export type ElementType = 'photo' | 'text' | 'sticker' | 'emoji' | 'bubble';

export interface ScrapbookElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  content: string; 
  bubbleType?: 'classic' | 'thought' | 'shout';
  frameType?: 'none' | 'polaroid' | 'classic' | 'wavy' | 'dashed';
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface ScrapbookPage {
  id: string;
  backgroundColor: string;
  backgroundImage?: string;
  elements: ScrapbookElement[];
}

export const ARTISTIC_FONTS = [
  'Fredoka',
  'Pacifico',
  'Yellowtail',
  'Creepster',
  'UnifrakturMaguntia',
  'Bungee Shade',
  'Monoton',
  'Special Elite',
  'Press Start 2P',
  'Permanent Marker',
];

export const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
  '#ffff00', '#ff00ff', '#00ffff', '#f87171', '#fbbf24', 
  '#34d399', '#60a5fa', '#ec4899', '#8b5cf6', '#d1d5db'
];

export const STICKERS = [
  { id: 'heart', url: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', name: 'Cuore' },
  { id: 'star', url: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', name: 'Stella' },
  { id: 'camera', url: 'https://cdn-icons-png.flaticon.com/512/685/685655.png', name: 'Camera' },
  { id: 'flower', url: 'https://cdn-icons-png.flaticon.com/512/590/590500.png', name: 'Fiore' },
  { id: 'sun', url: 'https://cdn-icons-png.flaticon.com/512/869/869869.png', name: 'Sole' },
  { id: 'rainbow', url: 'https://cdn-icons-png.flaticon.com/512/2584/2584042.png', name: 'Arcobaleno' },
  { id: 'coffee', url: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', name: 'Caffè' },
  { id: 'plane', url: 'https://cdn-icons-png.flaticon.com/512/201/201623.png', name: 'Aereo' },
  { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/1864/1864509.png', name: 'Gatto' },
  { id: 'music', url: 'https://cdn-icons-png.flaticon.com/512/2907/2907253.png', name: 'Musica' },
  { id: 'balloon', url: 'https://cdn-icons-png.flaticon.com/512/1046/1046830.png', name: 'Palloncino' },
  { id: 'rocket', url: 'https://cdn-icons-png.flaticon.com/512/1043/1043542.png', name: 'Razzo' },
];

export const BACKGROUNDS = [
  { id: 'watercolor', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80', name: 'Acquerello' },
  { id: 'vintage', url: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=1200&q=80', name: 'Vero Vintage' },
  { id: 'abstract', url: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=1200&q=80', name: 'Astratto' },
  { id: 'pattern-paper', url: 'css-pattern-paper', name: 'Carta' },
  { id: 'stars', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1200&q=80', name: 'Notte' },
  { id: 'pattern-dots', url: 'css-pattern-dots', name: 'Pois' },
  { id: 'pattern-wood', url: 'css-pattern-wood', name: 'Legno' },
];
