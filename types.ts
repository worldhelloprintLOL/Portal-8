
export type GameCategory = 'All' | 'Action' | 'Puzzle' | 'Sports' | 'Strategy' | 'Retro' | 'Idle';

export interface Game {
  id: string;
  title: string;
  category: GameCategory;
  description: string;
  thumbnail: string;
  iframeUrl: string;
  isPopular?: boolean;
}

export interface AppState {
  searchQuery: string;
  activeCategory: GameCategory;
  favorites: string[];
}
