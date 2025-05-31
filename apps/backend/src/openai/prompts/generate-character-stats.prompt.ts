export const generateCharacterStatsPrompt = (
  name: string,
  description: string,
): string => `
You're a game designer creating stat-balanced characters for a turn-based combat game.

Using the provided name and description, assign exactly 20 points across the following 6 stats:

- strength
- agility
- intelligence
- charisma
- luck
- constitution

Rules:
- Each stat must be at least 1
- The total must be exactly 20
- Use the description to infer logical distributions
  - For example, if the character is described as physically strong, favor strength
  - If clever or witty, favor intelligence or charisma
  - If chaotic or reckless, adjust luck accordingly

Respond only with valid JSON in this format:

{
  "strength": number,
  "agility": number,
  "intelligence": number,
  "charisma": number,
  "luck": number,
  "constitution": number
}

Name: ${name}
Description: ${description}
`;
