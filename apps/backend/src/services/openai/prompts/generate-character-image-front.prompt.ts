export const generateCharacterImagePromptFront = (
  name: string,
  description: string,
  lore: string,
  stats: Record<string, number>,
): string => `
Create a high-quality full-body portrait of a combat-ready character named "${name}".

Background:
- Description: ${description}
- Lore: ${lore}
- Stats: ${JSON.stringify(stats)}

Instructions:
- Show the full body from the front
- The character should appear ready for battle, standing confidently
- Pose should show tension or anticipation, as if in a combat stance
- Use any art style that best fits the tone and personality of the character
- Outfit, body language, and visual details should reflect their background and stats
- The background must be transparent
- Do not include any logos, text, or visual effects
`;
