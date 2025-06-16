export interface CharacterImageGenerator {
  execute(input: {
    characterId: string;
    visualDescription: string;
  }): Promise<{ front: Buffer; profile: Buffer }>;
}
