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

export type CharacterEnrichmentResult = {
  lore: string;
  imagePromptPortrait: string;
  imagePromptFullBodyCombat: string;
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
