import type { CharacterStats } from "../types/character";

export const STAT_EMOJI_MAP: Record<keyof CharacterStats, string> = {
  strength: '💪',
  agility: '🤸',
  intelligence: '🧠',
  charisma: '🗣️',
  luck: '🍀',
  constitution: '🛡️',
}
