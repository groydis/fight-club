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

export type SuggestCharacterStatsDto = {
  name: string
  description: string
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
  imageBackUrl?: string;
  imageProfileUrl?: string;
  moves: CharacterMoveDetailed[];
  userId?: string;
}


