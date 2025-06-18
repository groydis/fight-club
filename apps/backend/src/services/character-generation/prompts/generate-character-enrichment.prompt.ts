export const generateCharacterPrompt = (
  name: string,
  description: string,
  gender: string,
  species: string,
  alignment: string,
  stats: Record<string, number>,
  basicMoves: { name: string; primaryStat: string }[],
  specialMoves: { name: string; primaryStat: string }[],
): string => `
You are an AI assistant for a gritty, darkly humorous character generator used in a turn-based combat game.

Here is a new character submission:

Name: ${name}  
Gender: ${gender}  
Species: ${species}  
Alignment: ${alignment}  
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

---

### 1. Backstory Lore
Write a short character backstory (under 150 words).  
Use the character's information and stats to build a distinct, memorable bio.  
The tone can be tragic, hilarious, mysterious, or unsettling — but never boring.

---

### 2. Move Descriptions
For each move (basic and special), generate:
- A creative 1–2 sentence description based on the move name and primary stat.
- A base effect value (10–100) appropriate to the stat and tone.

---

### 3. Visual Description (Structured)
Create a structured object that breaks down the character’s visual appearance.  
This will be used to generate AI art, so it must focus on physical traits, outfit, body shape, and mood — **not lore or stats directly**.

Use the following format:

"visualDescription": {
  "facialFeatures": "string",
  "bodyType": "string",
  "personalityVibe": "string",
  "outfit": "string",
  "colorPalette": "string",
  "species": "string",
  "genderPresentation": "string",
  "visualSymbols": ["string", ...]
}

---

### 4. Image Generation Hints
Based on the visual description and species, generate hints for configuring an AI image generation pipeline.

Respond with:

"imageGenerationHints": {
  "characterType": "string", // e.g. 'cybernetic duck rogue', 'mutant brawler toaster'
  "modelPreference": "string", // optional - Leonardo model ID
  "negativePrompt": "string", // what to avoid during image generation (e.g. 'realism, human face, background, text')
  "preferredStyleId": "string", // optional - style uuid
  "recommendedImagePromptOverrides": {
    "frontPoseHint": "string",
    "profilePoseHint": "string"
  }
}

---

### Final Output Format

Respond only with valid JSON:

{
  "lore": "string",
  "visualDescription": {
    "facialFeatures": "string",
    "bodyType": "string",
    "personalityVibe": "string",
    "outfit": "string",
    "colorPalette": "string",
    "species": "string",
    "genderPresentation": "string",
    "visualSymbols": ["string", ...]
  },
  "imageGenerationHints": {
    "characterType": "string",
    "modelPreference": "string",
    "negativePrompt": "string",
    "preferredStyleId": "string",
    "recommendedImagePromptOverrides": {
      "frontPoseHint": "string",
      "profilePoseHint": "string"
    }
  },
  "basicMoves": [
    { "name": "string", "description": "string", "effectValue": number }
  ],
  "specialMoves": [
    { "name": "string", "description": "string", "effectValue": number }
  ]
}
`;
