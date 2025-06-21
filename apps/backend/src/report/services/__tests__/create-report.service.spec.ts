import { Test, TestingModule } from '@nestjs/testing';
import { CreateReportService } from '../create-report.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { UserRole, UserStatus, CharacterStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CharacterReportReason } from '../../../common/types/report.types';

describe('CreateReportService', () => {
  let service: CreateReportService;
  let prisma: PrismaService;
  let testUserId: string;
  let testCharacterId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateReportService, PrismaService],
    }).compile();

    service = module.get(CreateReportService);
    prisma = module.get(PrismaService);

    testUserId = faker.string.uuid();
    testCharacterId = faker.string.uuid();

    await prisma.user.create({
      data: {
        id: testUserId,
        name: 'Test User',
        email: faker.internet.email(),
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.character.create({
      data: {
        id: testCharacterId,
        name: 'Test Character',
        description: 'Just testing',
        stats: {
          strength: 1,
          agility: 1,
          intelligence: 1,
          charisma: 1,
          luck: 1,
          constitution: 1,
        },
        status: CharacterStatus.READY,
        lore: 'Generated for testing',
        imageProfileUrl: 'https://cdn/test.png',
        userId: testUserId,
      },
    });
  });

  afterEach(async () => {
    await prisma.characterReport.deleteMany({});
    await prisma.character.deleteMany({ where: { id: testCharacterId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  it('should create a character report', async () => {
    await expect(
      service.execute(
        {
          characterId: testCharacterId,
          reason: CharacterReportReason.NSFW,
          detail: 'This image is borderline NSFW',
        },
        testUserId,
      ),
    ).resolves.toBeUndefined();

    const reports = await prisma.characterReport.findMany({
      where: { characterId: testCharacterId },
    });

    expect(reports.length).toBe(1);
    expect(reports[0]).toMatchObject({
      characterId: testCharacterId,
      reason: CharacterReportReason.NSFW,
      detail: 'This image is borderline NSFW',
      userId: testUserId,
    });
  });

  it('should throw NotFoundException for invalid characterId', async () => {
    await expect(
      service.execute(
        {
          characterId: 'non-existent-id',
          reason: CharacterReportReason.COPYRIGHTED_CONTENT,
          detail: 'Looks spammy',
        },
        testUserId,
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
