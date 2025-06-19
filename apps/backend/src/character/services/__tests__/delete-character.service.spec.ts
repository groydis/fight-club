// src/character/services/__tests__/delete-character.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCharacterService } from '../delete-character.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CharacterStatus, UserRole, UserStatus } from '@prisma/client';

describe('DeleteCharacterService', () => {
  let service: DeleteCharacterService;
  let prisma: PrismaService;

  const testUserId = faker.string.uuid();
  const testCharacterId = 'char-delete-001';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeleteCharacterService, PrismaService],
    }).compile();

    service = module.get(DeleteCharacterService);
    prisma = module.get(PrismaService);

    await prisma.user.create({
      data: {
        id: testUserId,
        name: 'deleteUser',
        email: faker.internet.exampleEmail(),
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.character.create({
      data: {
        id: testCharacterId,
        name: 'Delete Me',
        description: 'Character to be soft-deleted',
        stats: {
          strength: 5,
          agility: 5,
          intelligence: 5,
          charisma: 5,
          luck: 5,
          constitution: 5,
        },
        status: CharacterStatus.READY,
        lore: 'Soon to be archived...',
        imageProfileUrl: 'https://cdn/delete.png',
        userId: testUserId,
        archived: false,
      },
    });
  });

  afterEach(async () => {
    await prisma.character.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  it('should soft-delete (archive) the character', async () => {
    await service.execute(testUserId, testCharacterId);

    const archivedChar = await prisma.character.findUnique({
      where: { id: testCharacterId },
    });

    expect(archivedChar?.archived).toBe(true);
  });

  it('should throw if character is already archived', async () => {
    await prisma.character.update({
      where: { id: testCharacterId },
      data: { archived: true },
    });

    await expect(service.execute(testUserId, testCharacterId)).rejects.toThrow(
      'Character not found or already archived',
    );
  });

  it('should throw if character does not exist', async () => {
    await expect(
      service.execute(testUserId, 'non-existent-id'),
    ).rejects.toThrow('Character not found or already archived');
  });
});
