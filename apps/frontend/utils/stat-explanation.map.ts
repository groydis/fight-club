import type { CharacterSuggestion } from "~/types/character";

export const STAT_EXPLANATION_MAP: Record<keyof CharacterSuggestion['stats'], string> = {
  strength: 'Increases damage of physical attacks and melee-based moves.',
  agility: 'Improves dodge chance and effectiveness of speed-based moves.',
  intelligence: 'Boosts damage and effects of smart or strategic moves.',
  charisma: 'Affects support moves, speech-based effects, and persuasion.',
  luck: 'Increases chances of critical hits or lucky outcomes.',
  constitution: 'Raises health, defense, and resistance to effects.',
};
