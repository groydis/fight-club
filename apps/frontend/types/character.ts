export type CharacterStats = {
  strength: number
  agility: number
  intelligence: number
  charisma: number
  luck: number
  constitution: number
}

export type CharacterMove = {
  name: string;
  primaryStat: keyof CharacterStats;
};

export type CharacterSuggestion = {
  stats: CharacterStats
  basicMoves: CharacterMove[]
  specialMoves: CharacterMove[]
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


export type SuggestCharacterStatsDto = {
  name: string
  description: string
  gender: CharacterGender
  species: string,
  alignment: CharacterAlignment
}

export type CreateCharacterDto = {
  name: string
  description: string
  stats: CharacterStats
  basicMoves: CharacterMove[]
  specialMoves: CharacterMove[]
}

export type MoveType = {
    BASIC: "BASIC";
    SPECIAL: "SPECIAL";
}

export type StatType =
  | 'strength'
  | 'agility'
  | 'constitution'
  | 'luck'
  | 'intelligence'
  | 'charisma';

export type CharacterMoveDetailed = {
  name: string;
  description: string;
  effectValue: number;
  primaryStat: StatType;
  type: MoveType;
}

export type Character = {
  id: string;
  name: string;
  description: string;
  lore: string;
  stats: Record<string, number>;
  status: string;
  imageFrontUrl?: string;
  imageProfileUrl?: string;
  moves: CharacterMoveDetailed[];
  userId?: string;
  alignment?: CharacterAlignment;
  species: string;
  gender: CharacterGender;
  trainer?: string;
}


