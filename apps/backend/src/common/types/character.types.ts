import { MoveType } from '@prisma/client';

export type CharacterStats = {
  strength: number;
  agility: number;
  intelligence: number;
  charisma: number;
  luck: number;
  constitution: number;
};

export type CharacterSuggestion = {
  stats: CharacterStats;
  basicMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
  }[];
  specialMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
  }[];
};

export interface VisualDescription {
  facialFeatures: string; // Eyes, expression, scars, etc.
  bodyType: string; // Height, build, posture, number of limbs
  personalityVibe: string; // What kind of energy the character gives off
  outfit: string; // Clothing, armor, accessories
  colorPalette: string; // General colors or themes
  species: string; // E.g. Human, mutant, android, catfish
  genderPresentation: string; // How gender is visually expressed (if at all)
  visualSymbols: string[]; // Unique identifying traits (tattoos, items, etc.)
}

export interface ImageGenerationHints {
  characterType: string; // e.g. "cybernetic duck rogue"
  modelPreference?: string; // Leonardo model ID or name (optional)
  negativePrompt: string; // What to avoid in the generation
  preferredStyleId?: string; // Leonardo style ID or label
  recommendedImagePromptOverrides?: {
    frontPoseHint?: string;
    profilePoseHint?: string;
  };
}

export type CharacterEnrichmentResult = {
  lore: string;
  visualDescription: VisualDescription;
  imageGenerationHints: ImageGenerationHints;
  basicMoves: {
    name: string;
    description: string;
    effectValue: number;
  }[];
  specialMoves: {
    name: string;
    description: string;
    effectValue: number;
  }[];
};

export type BaseCharacterInput = {
  name: string;
  description: string;
  stats: CharacterStats;
  gender: CharacterGender;
  species: string;
  alignment: CharacterAlignment;
  basicMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
  }[];
  specialMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
  }[];
};

export type FullCharacter = {
  name: string;
  description: string;
  lore: string;
  stats: CharacterStats;
  gender?: CharacterGender;
  species?: string;
  alignment?: CharacterAlignment;
  basicMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
    description: string;
    effectValue: number;
  }[];
  specialMoves: {
    name: string;
    primaryStat: keyof CharacterStats;
    description: string;
    effectValue: number;
  }[];
};

export type StatType =
  | 'strength'
  | 'agility'
  | 'constitution'
  | 'luck'
  | 'intelligence'
  | 'charisma';

export class CharacterMove {
  name: string;
  description: string;
  effectValue: number;
  primaryStat: StatType;
  type: MoveType;
}

export class Character {
  id: string;
  name: string;
  description: string;
  lore: string;
  stats: Record<string, number>;
  status: string;
  gender?: CharacterGender;
  species?: string;
  alignment?: CharacterAlignment;
  imageFrontUrl?: string;
  imageProfileUrl?: string;
  moves: CharacterMove[];
  trainer?: string;
  userId?: string;
}

export enum CharacterGender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  Unknown = 'Unknown',
}

export enum CharacterAlignment {
  LawfulGood = 'LawfulGood',
  NeutralGood = 'NeutralGood',
  ChaoticGood = 'ChaoticGood',
  LawfulNeutral = 'LawfulNeutral',
  TrueNeutral = 'TrueNeutral',
  ChaoticNeutral = 'ChaoticNeutral',
  LawfulEvil = 'LawfulEvil',
  NeutralEvil = 'NeutralEvil',
  ChaoticEvil = 'ChaoticEvil',
}
