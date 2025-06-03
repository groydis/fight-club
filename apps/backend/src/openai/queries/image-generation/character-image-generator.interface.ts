export interface CharacterImageGenerator {
  execute(input: {
    frontPrompt: string;
    backPrompt: string;
    profilePrompt: string;
  }): Promise<{ front: Buffer; back: Buffer; profile: Buffer }>;
}
