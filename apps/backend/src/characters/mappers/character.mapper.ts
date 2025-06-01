import { Prisma } from '@prisma/client';
import { CharacterDto } from '../dto/character.dto';

export type FullCharacter = Prisma.CharacterGetPayload<{
  include: {
    moves: true; // or select specific fields if you want stricter typing
  };
}>;

export function toCharacterDto(character: FullCharacter): CharacterDto {
  return {
    id: character.id,
    name: character.name,
    description: character.description,
    lore: character.lore,
    status: character.status,
    stats: character.stats as Record<string, number>,
    moves: character.moves.map((move) => ({
      name: move.name,
      description: move.description,
      effectValue: move.effectValue,
      primaryStat: move.stat,
      type: move.type,
    })),
  };
}
