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

// This is what you'll store or return after enrichment
export type FullCharacter = {
  name: string;
  description: string;
  lore: string;
  stats: CharacterStats;
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
  imageFrontUrl?: string;
  imageBackUrl?: string;
  imageProfileUrl?: string;
  moves: CharacterMove[];
  userId?: string;
}
