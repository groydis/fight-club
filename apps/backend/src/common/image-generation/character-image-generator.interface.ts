export interface CharacterImageGenerator {
  generateImages(input: {
    name: string;
    description: string;
    lore: string;
    stats: Record<string, number>;
  }): Promise<{
    front: Buffer;
    back: Buffer;
  }>;
}
