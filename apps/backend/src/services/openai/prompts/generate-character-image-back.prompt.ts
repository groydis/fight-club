export const generateCharacterImagePromptBack = (
  name: string,
  description: string,
  lore: string,
  stats: Record<string, number>,
): string => `
Create a high-quality back-facing portrait of the character "${name}".

Background:
- Description: ${description}
- Lore: ${lore}
- Stats: ${JSON.stringify(stats)}

Instructions:
- Show the character from behind, waist-up
- Arms may be slightly lifted or in a ready pose
- Head should be slightly turned as if they're aware of someone behind them
- Emphasize hair, outfit, and posture to convey mood and role
- The art style should fit the character's tone — gritty, elegant, chaotic, etc.
- The background must be transparent
- Do not include logos, text, or visual effects
`;
