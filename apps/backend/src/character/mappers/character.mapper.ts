import { Prisma } from '@prisma/client';
import {
  Character,
  CharacterAlignment,
  CharacterGender,
  StatType,
} from '../../common/types/character.types';

export type FullCharacter = Prisma.CharacterGetPayload<{
  include: {
    moves: true;
  };
}>;

export function toCharacterDto(character: FullCharacter): Character {
  return {
    id: character.id,
    name: character.name,
    description: character.description,
    lore: character.lore,
    stats: character.stats as Record<string, number>,
    status: character.status,
    gender: (character.gender as CharacterGender) ?? undefined,
    species: character.species ?? undefined,
    alignment: (character.alignment as CharacterAlignment) ?? undefined,
    imageFrontUrl: character.imageFrontUrl ?? undefined,
    imageProfileUrl: character.imageProfileUrl ?? undefined,
    moves: character.moves.map((move) => ({
      name: move.name,
      description: move.description,
      effectValue: move.effectValue,
      primaryStat: move.stat as StatType,
      type: move.type,
    })),
    userId: character.userId ?? undefined,
  };
}
