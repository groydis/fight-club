// test-utils/mock-character-data.ts
import { CharacterSuggestion } from '../common/types/character.types';

export const mockSuggestion: CharacterSuggestion = {
  stats: {
    strength: 6,
    agility: 6,
    intelligence: 5,
    charisma: 4,
    luck: 5,
    constitution: 4,
  },
  basicMoves: [
    { name: 'Spoon Slam', primaryStat: 'strength' },
    { name: 'Slippery Swipe', primaryStat: 'agility' },
    { name: 'Breadstick Jab', primaryStat: 'agility' },
    { name: 'Crouton Kick', primaryStat: 'strength' },
    { name: 'Boil Punch', primaryStat: 'constitution' },
    { name: 'Salt Fling', primaryStat: 'luck' },
  ],
  specialMoves: [
    { name: 'Boil Over', primaryStat: 'constitution' },
    { name: 'Gravy Geyser', primaryStat: 'luck' },
    { name: 'Ladle of Justice', primaryStat: 'strength' },
    { name: 'Steam Surge', primaryStat: 'intelligence' },
    { name: 'Molten Splash', primaryStat: 'strength' },
    { name: 'Salty Smile', primaryStat: 'charisma' },
  ],
};

export const mockEnriched = {
  lore: 'Forged in the depths of a forgotten soup kitchen.',
  basicMoves: [
    {
      name: 'Spoon Slam',
      description: 'Hits hard with broth-laced power.',
      effectValue: 20,
    },
    {
      name: 'Slippery Swipe',
      description: 'Slips through defense like oil.',
      effectValue: 15,
    },
  ],
  specialMoves: [
    {
      name: 'Boil Over',
      description: 'Unleashes molten gravy.',
      effectValue: 40,
    },
    {
      name: 'Gravy Geyser',
      description: 'Erupts in seasoned fury.',
      effectValue: 35,
    },
  ],
};
