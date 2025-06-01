// characters/dto/character.dto.ts
import { MoveType } from 'generated/prisma';

export class CharacterMoveDto {
  name: string;
  description: string;
  effectValue: number;
  primaryStat: string;
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
}
