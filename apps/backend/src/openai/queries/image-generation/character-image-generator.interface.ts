export interface CharacterImageGenerator {
  execute(input: {
    name: string;
    description: string;
    lore: string;
    stats: Record<string, number>;
  }): Promise<{ front: Buffer; back: Buffer; profile: Buffer }>;
}
