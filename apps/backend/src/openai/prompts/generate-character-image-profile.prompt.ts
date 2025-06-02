export const generateCharacterImagePromptProfile = (
  name: string,
  description: string,
  lore: string,
  stats: Record<string, number>,
): string => `
Create a high-quality facial portrait of the character "${name}".

Background:
- Description: ${description}
- Lore: ${lore}
- Stats: ${JSON.stringify(stats)}

Instructions:
- Show the head and shoulders, facing forward
- Facial expression should reflect the character’s personality
- Emphasize eyes, hairstyle, and any unique features
- Art style should suit the mood — gritty, futuristic, mythical, etc.
- The background must be transparent
- No text, borders, or visual overlays
`;
