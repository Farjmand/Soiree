export interface PartyForm {
  occasion: string;
  vibe: string;
  season: string;
  culturalFlavor: string;
}

export interface FoodItem {
  name: string;
  description: string;
}

export interface DressCode {
  title: string;
  description: string;
  colors: string[];
  avoid: string;
}

export interface PartyTheme {
  themeName: string;
  themeEmoji: string;
  themeDescription: string;
  foodItems: FoodItem[];
  dresscode: DressCode;
}

export type AppView = 'input' | 'results' | 'detail';
