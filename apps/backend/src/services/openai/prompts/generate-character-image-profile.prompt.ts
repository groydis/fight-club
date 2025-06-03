export const generateCharacterImagePromptProfile = (
  name: string,
  description: string,
  lore: string,
  stats: Record<string, number>,
): string => {
  return `
Create a realistic, high-quality passport-style photo of a fictional character named "${name}".

- The photo should show only the character’s head and shoulders, facing directly forward.
- Background must be plain or neutral (like a typical passport photo).
- The character’s expression, features, and style should subtly reflect their personality and abilities.

About the character:
${description}

Background:
${lore}

Traits (for visual influence only, not display):
${generateStatSummary(stats)}

Strict rules:
- DO NOT include any text, numbers, stats, labels, or UI overlays.
- This is NOT a character card — just a clean ID-style portrait.
`;
};

function generateStatSummary(stats: Record<string, number>): string {
  const descriptors: string[] = [];

  for (const [key, value] of Object.entries(stats)) {
    descriptors.push(`${key}: ${describeStat(value)}`);
  }

  return descriptors.join(', ');
}

function describeStat(value: number): string {
  if (value >= 9) return 'extremely high';
  if (value >= 7) return 'high';
  if (value >= 4) return 'average';
  if (value >= 2) return 'low';
  return 'very low';
}
