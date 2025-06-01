export const generateCharacterSuggestionsPrompt = (
  name: string,
  description: string,
): string => `
You're a game designer creating characters for a turn-based combat game.

Using the provided name and description, suggest a character build.

### Part 1: Stats
Distribute exactly 30 points across the following 6 stats:
- strength
- agility
- intelligence
- charisma
- luck
- constitution

Rules:
- Each stat must be at least 1
- The total must equal exactly 30
- Use the description to infer logical allocations

### Part 2: Moves
Suggest:
- 6 basic move names
- 6 special move names

Each move must be associated with a primary stat. This stat is the main attribute that powers or influences the move.

Use the character theme and description for inspiration. Only provide the move names and their associated primary stat — do not include any additional descriptions or effects.

### Output format:
Respond only with valid JSON in the following format:

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
    { "name": "...", "primaryStat": "strength" }
  ],
  "specialMoves": [
    { "name": "...", "primaryStat": "agility" }
  ]
}

Name: ${name}
Description: ${description}
`;
