export const generateCharacterPrompt = (
  name: string,
  description: string,
  stats: Record<string, number>,
  basicMoves: { name: string; primaryStat: string }[],
  specialMoves: { name: string; primaryStat: string }[],
): string => `
You are an AI assistant for a gritty, darkly humorous character battle game.

Here is a new character submission:
Name: ${name}
Description: ${description}
Stats: ${JSON.stringify(stats, null, 2)}

Basic Moves:
${basicMoves
  .map((m, i) => `  ${i + 1}. "${m.name}" (Primary Stat: ${m.primaryStat})`)
  .join('\n')}

Special Moves:
${specialMoves
  .map((m, i) => `  ${i + 1}. "${m.name}" (Primary Stat: ${m.primaryStat})`)
  .join('\n')}

Your tasks are:
1. Write a short lore paragraph (under 150 words) that matches the tone of the name, description, and stats.
2. For each move, generate:
   - A creative 1–2 sentence description that reflects the move's name and primary stat.
   - A base effect value between 10 and 100 that is appropriate to the move type and stat.
3. Write three **safe, structured image generation prompts** that will be used with DALL·E 3 to generate visuals of this character. These prompts must not include names, stats, or violence. Avoid any content that could trigger moderation filters. Provide:

- \`imagePromptPortrait\`: A safe prompt for a **passport-style, head-and-shoulders portrait**. Neutral or blurred background. No text or labels.
- \`imagePromptBackFacing\`: A safe prompt for a **back-facing half-body portrait** (waist-up). Arms can be lifted. Head slightly turned to imply awareness. Must use transparent background.
- \`imagePromptFullBodyCombat\`: A safe prompt for a **full-body combat-ready stance**. Character should appear confident and tense. Transparent background. No visual effects or text.

Output only valid JSON in the following format:
{
  "lore": "string",
  "imagePromptPortrait": "string",
  "imagePromptBackFacing": "string",
  "imagePromptFullBodyCombat": "string",
  "basicMoves": [
    { "name": "string", "description": "string", "effectValue": number },
    ...
  ],
  "specialMoves": [
    { "name": "string", "description": "string", "effectValue": number },
    ...
  ]
}
`;
