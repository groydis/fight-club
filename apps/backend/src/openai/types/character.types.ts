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
  basicMoves: { name: string }[];
  specialMoves: { name: string }[];
};
