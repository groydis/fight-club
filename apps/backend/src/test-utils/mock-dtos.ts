import {
  CharacterAlignment,
  CharacterGender,
} from '../common/types/character.types';
import { mockSuggestion } from './mock-character.data';

export const suggestDto = {
  name: 'Groovy Gravy',
  description: 'A soup-slinging menace with a poetic soul.',
  gender: CharacterGender.Other,
  species: 'Human',
  alignment: CharacterAlignment.LawfulNeutral,
};

export const createDto = {
  ...suggestDto,
  stats: mockSuggestion.stats,
  basicMoves: mockSuggestion.basicMoves
    .slice(0, 2)
    .map(({ name, primaryStat }) => ({
      name,
      primaryStat,
    })),
  specialMoves: mockSuggestion.specialMoves
    .slice(0, 2)
    .map(({ name, primaryStat }) => ({
      name,
      primaryStat,
    })),
};
