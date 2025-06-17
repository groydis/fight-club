import {
  ImageGenerationHints,
  VisualDescription,
} from '../../../common/types/character.types';

export interface CharacterImageGenerator {
  execute(input: {
    characterId: string;
    visualDescription: VisualDescription;
    imageGenerationHints: ImageGenerationHints;
  }): Promise<{ front: Buffer; profile: Buffer }>;
}
