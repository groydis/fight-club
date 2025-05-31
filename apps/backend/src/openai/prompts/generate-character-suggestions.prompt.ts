export const generateCharacterSuggestionsPrompt = (
  name: string,
  description: string,
): string => `
You're a game designer creating characters for a turn-based combat game.

Using the provided name and description, suggest a character build.

### Part 1: Stats
Distribute exactly 20 points across the following 6 stats:
- strength
- agility
- intelligence
- charisma
- luck
- constitution

Rules:
- Each stat must be at least 1
- The total must equal exactly 20
- Use the description to infer logical allocations

### Part 2: Moves
Suggest:
- 5 basic move names
- 5 special move names

Use the description and character theme for inspiration. Only provide the move names — no descriptions or effects.

### Output format:
Respond only with valid JSON:

{
  "stats": {
    "strength": number,
    "agility": number,
    "intelligence": number,
    "charisma": number,
    "luck": number,
    "constitution": number
  },
  "basicMoves": [
    { "name": "..." }
  ],
  "specialMoves": [
    { "name": "..." }
  ]
}

Name: ${name}
Description: ${description}
`;
