import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import { UpdateUserService } from './update-user.service';
import { faker } from '@faker-js/faker';
import {
  createMockAuthUser,
  MockAuthUser,
} from '../../test-utils/create-mock-auth-user';

describe('UpdateUsersService (Integration)', () => {
  let prisma: PrismaService;
  let service: UpdateUserService;
  let testUser: MockAuthUser;
  const testUserIds: string[] = [];

  const newUsername = faker.internet.username();
  const newName = faker.person.firstName();
  const newEmail = faker.internet.exampleEmail();
  const newBio = faker.person.bio();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateUserService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<UpdateUserService>(UpdateUserService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: testUserIds } },
    });
  });

  beforeEach(async () => {
    testUser = await createMockAuthUser(prisma);
    testUserIds.push(testUser.id);
  });

  it('successfully updates username, name, email, and bio', async () => {
    const result = await service.excute(testUser.id, {
      username: newUsername,
      name: newName,
      email: newEmail,
      bio: newBio,
    });

    expect(result.id).toBe(testUser.id);
    expect(result.username).toBe(newUsername);
    expect(result.name).toBe(newName);
    expect(result.email).toBe(newEmail);
    expect(result.bio).toBe(newBio);
    // Ensure the database actually persisted it
    const persisted = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    expect(persisted).not.toBeNull();
    expect(persisted!.username).toBe(newUsername);
    expect(persisted!.name).toBe(newName);
    expect(persisted!.email).toBe(newEmail);
    expect(persisted!.bio).toBe(newBio);
  });

  it('throws ConflictException if username is already taken', async () => {
    await expect(
      service.excute(testUser.id, { username: newUsername }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws ConflictException if email is already taken', async () => {
    await expect(
      service.excute(testUser.id, { email: newEmail }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
