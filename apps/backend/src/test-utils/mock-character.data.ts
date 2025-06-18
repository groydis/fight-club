// test-utils/mock-character-data.ts
import {
  CharacterEnrichmentResult,
  CharacterSuggestion,
} from '../common/types/character.types';

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

export const mockEnriched: CharacterEnrichmentResult = {
  lore: 'Forged in the depths of a forgotten soup kitchen.',
  visualDescription: {
    facialFeatures:
      'Sharp, angular jawline with high cheekbones and glowing yellow eyes. A jagged scar runs down the left side of the face, barely missing the eye. Eyebrows are thin and arched, giving a perpetually suspicious look.',
    bodyType:
      'Tall and lean with a wiry frame. Long limbs and clawed fingers. Posture is always tense, as if ready to spring into action.',
    personalityVibe:
      'Cunning and unpredictable, like a rogue who thrives in chaos. Gives off an unsettling, unblinking confidence.',
    outfit:
      'Dark, asymmetrical leather armor with reinforced shoulder plating. A hooded cloak frayed at the edges, and various pouches strapped to the waist.',
    colorPalette: 'Muted greys, tarnished golds, and glowing amber highlights.',
    species: 'Voidborne Half-elf',
    genderPresentation:
      'Androgynous with a slight masculine lean, accentuated by angular features and a low voice.',
    visualSymbols: [
      'A broken compass hanging from a chain',
      'A glowing rune tattooed across the right forearm',
      'A torn faction insignia sewn onto the cloak',
    ],
  },
  imageGenerationHints: {
    characterType: 'chaotic rogue from a magical wasteland',
    modelPreference: '6c95de60-a0bc-4f90-b637-ee8971caf3b0',
    negativePrompt:
      'no futuristic armor, no sci-fi helmets, no neon cyberpunk colors, avoid cartoonish style',
    preferredStyleId: '8e2bc543-6ee2-45f9-bcd9-594b6ce84dcd',
    recommendedImagePromptOverrides: {
      frontPoseHint:
        'slouched forward with intense glare, hands slightly visible at chest level',
      profilePoseHint:
        'half-turned with cloak flaring out, head angled down and eyes upward',
    },
  },
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
