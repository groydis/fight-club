import { MoveType } from '@prisma/client';

export type StatType =
  | 'strength'
  | 'agility'
  | 'constitution'
  | 'luck'
  | 'intelligence'
  | 'charisma';

export class CharacterMoveDto {
  name: string;
  description: string;
  effectValue: number;
  primaryStat: StatType;
  type: MoveType;
}

export class CharacterDto {
  id: string;
  name: string;
  description: string;
  lore: string;
  status: string;
  stats: Record<string, number>;
  moves: CharacterMoveDto[];
  userId?: string;
}
