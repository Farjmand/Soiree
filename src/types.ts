export interface PartyForm {
  occasion: string;
  vibe: string;
  season: string;
  culturalFlavor: string;
  fictionalUniverse: string;
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
  themeDescription: string[];
  foodItems: FoodItem[];
  dresscode: DressCode;
}

export interface Recipe {
  ingredients: string[];
  instructions: string[];
}

export type AppView = 'input' | 'results' | 'detail';
