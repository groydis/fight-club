export const generateCharacterPrompt = (
  name: string,
  description: string,
  stats: Record<string, number>,
  basicMoves: { name: string; primaryStat: string }[],
  specialMoves: { name: string; primaryStat: string }[],
): string => `
You are an AI assistant for a gritty, darkly humorous character generator.

Here is a new character submission:
Name: ${name}
Description: ${description}
Stats:
${JSON.stringify(stats, null, 2)}

Basic Moves:
${basicMoves
  .map((m, i) => `  ${i + 1}. "${m.name}" (Primary Stat: ${m.primaryStat})`)
  .join('\n')}

Special Moves:
${specialMoves
  .map((m, i) => `  ${i + 1}. "${m.name}" (Primary Stat: ${m.primaryStat})`)
  .join('\n')}

Your tasks are:

1. Generate a short lore paragraph (under 150 words) that explains the personality and history of the character, matching the tone of the name, description, and stats.

2. For each move (both Basic Moves and Special Moves), generate:
   - A creative 1–2 sentence description that reflects the move's name and primary stat.
   - A base effect value between 10 and 100 that is appropriate to the move type and stat.

3. Write two **safe, structured image generation prompts** that will be used with the gpt-image-1 model to generate visuals of this character. These prompts must not include names, stats, or violence, and must avoid any content that could trigger moderation filters. Each prompt must start and end with specific generation rules. Provide:

   - **imagePromptPortrait**: A safe, descriptive prompt for a front-facing, head-and-shoulders portrait. Character expression should match personality. End with: "No text or logos. Neutral or blurred background".
     - Start with: **front-facing, head-and-shoulders portrait**.
     - End with: **"No text or logos. Neutral or blurred background"**.

   - **imagePromptFullBodyCombat**: A safe, descriptive prompt for a full-body, combat-ready stance as if in a fighting RPG video game. Character should appear confident and tense. End with: "Transparent background. No text or logos. No visual effects."
     - Start with: **full-body combat-ready stance as if he is the character in a fighting RPG video game, side-profile of a pixel-art style martial artist:**
     - End with: **"Minimal color palette and blocky pixel detail. Transparent background. No text or logos. No visual effects."**

Output only valid JSON in the following format:
{
  "lore": "string",
  "imagePromptPortrait": "string",
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
