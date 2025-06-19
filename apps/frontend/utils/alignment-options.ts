export enum CharacterAlignment {
  LawfulGood = 'LawfulGood',
  NeutralGood = 'NeutralGood',
  ChaoticGood = 'ChaoticGood',
  LawfulNeutral = 'LawfulNeutral',
  TrueNeutral = 'TrueNeutral',
  ChaoticNeutral = 'ChaoticNeutral',
  LawfulEvil = 'LawfulEvil',
  NeutralEvil = 'NeutralEvil',
  ChaoticEvil = 'ChaoticEvil',
}

export const alignmentOptions = [
  { value: CharacterAlignment.LawfulGood, label: 'Lawful Good' },
  { value: CharacterAlignment.NeutralGood, label: 'Neutral Good' },
  { value: CharacterAlignment.ChaoticGood, label: 'Chaotic Good' },
  { value: CharacterAlignment.LawfulNeutral, label: 'Lawful Neutral' },
  { value: CharacterAlignment.TrueNeutral, label: 'True Neutral' },
  { value: CharacterAlignment.ChaoticNeutral, label: 'Chaotic Neutral' },
  { value: CharacterAlignment.LawfulEvil, label: 'Lawful Evil' },
  { value: CharacterAlignment.NeutralEvil, label: 'Neutral Evil' },
  { value: CharacterAlignment.ChaoticEvil, label: 'Chaotic Evil' },
]
