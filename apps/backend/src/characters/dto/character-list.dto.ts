import { CharacterStatus } from '@prisma/client';

export class CharacterListItemDto {
  id: string;
  name: string;
  imageProfileUrl: string | null;
  status: CharacterStatus;
}
