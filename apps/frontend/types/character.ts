export type CharacterStats = {
  strength: number
  agility: number
  intelligence: number
  charisma: number
  luck: number
  constitution: number
}

export type CharacterMove = {
  name: string
}

export type CharacterSuggestion = {
  stats: CharacterStats
  basicMoves: CharacterMove[]
  specialMoves: CharacterMove[]
}

export type SuggestCharacterStatsDto = {
  name: string
  description: string
}