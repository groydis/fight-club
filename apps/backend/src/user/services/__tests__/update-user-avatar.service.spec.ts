// tests/user-avatar.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserAvatarService } from '../update-user-avatar.service';
import { PrismaService } from '../../../services/prisma/prisma.service';
import { FILE_STORAGE } from '../../../common/tokens';
import { mockFileStorage } from '../../../test-utils/mock-services';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import {
  createMockAuthUser,
  MockAuthUser,
} from '../../../test-utils/create-mock-auth-user';

describe('UpdateUserAvatarService', () => {
  let service: UpdateUserAvatarService;
  let prisma: PrismaService;

  // Directory where Multer writes temp files
  const uploadDir = path.join('uploads', 'avatars');

  // Will hold a real user record created in the test DB
  let testUser: MockAuthUser;
  const testUserIds: string[] = [];

  beforeAll(async () => {
    // Ensure the temp folder exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserAvatarService,
        PrismaService,
        {
          provide: FILE_STORAGE,
          useValue: mockFileStorage,
        },
      ],
    }).compile();

    service = module.get<UpdateUserAvatarService>(UpdateUserAvatarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: testUserIds } },
    });
    // Remove any leftover files and close Prisma
    if (fs.existsSync(uploadDir)) {
      fs.rmSync(uploadDir, { recursive: true, force: true });
    }
  });

  beforeEach(async () => {
    // Create a fresh user in the test database
    testUser = await createMockAuthUser(prisma);
    testUserIds.push(testUser.id);
  });

  afterEach(() => {
    // Remove any temp files in uploads/avatars
    if (fs.existsSync(uploadDir)) {
      for (const f of fs.readdirSync(uploadDir)) {
        fs.unlinkSync(path.join(uploadDir, f));
      }
    }
    jest.clearAllMocks();
  });

  it('uploads an avatar successfully and updates avatarUrl', async () => {
    // 1) Create a temp file in uploads/avatars
    const tempFilename = `${faker.string.uuid()}.jpg`;
    const tempFilePath = path.join(uploadDir, tempFilename);
    fs.writeFileSync(tempFilePath, Buffer.from('dummy image data'));

    // 2) Call the service
    const returnedUser = await service.execute(
      testUser.id,
      tempFilename,
      'original.jpg',
      'image/jpeg',
    );

    // 3) mockFileStorage.upload should have been called with correct arguments
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockFileStorage.upload).toHaveBeenCalledWith(
      `user-${testUser.id}/avatar.jpg`,
      expect.any(Buffer),
      'image/jpeg',
    );

    // 4) The returned user should have avatarUrl set to the mock URL
    expect(returnedUser.avatarUrl).toBe(
      `https://mock-storage.local/user-${testUser.id}/avatar.jpg`,
    );

    // 5) The DB record should reflect the new avatarUrl
    const persisted = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    expect(persisted).not.toBeNull();
    expect(persisted!.avatarUrl).toBe(
      `https://mock-storage.local/user-${testUser.id}/avatar.jpg`,
    );

    // 6) The temp file should have been deleted
    expect(fs.existsSync(tempFilePath)).toBe(false);
  });

  it('throws BadRequestException when temp file is missing', async () => {
    const missingFilename = 'does-not-exist.png';
    await expect(
      service.execute(testUser.id, missingFilename, 'orig.png', 'image/png'),
    ).rejects.toBeInstanceOf(BadRequestException);

    // Ensure upload was never called
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockFileStorage.upload).not.toHaveBeenCalled();
  });

  it('throws BadRequestException if FileStorage.upload fails', async () => {
    // Create a temp file
    const tempFilename = `${faker.string.uuid()}.png`;
    const tempFilePath = path.join(uploadDir, tempFilename);
    fs.writeFileSync(tempFilePath, Buffer.from('dummy data'));

    // Make the mock upload reject
    (mockFileStorage.upload as jest.Mock).mockRejectedValueOnce(
      new Error('Upload error'),
    );

    await expect(
      service.execute(testUser.id, tempFilename, 'orig.png', 'image/png'),
    ).rejects.toBeInstanceOf(BadRequestException);

    // Temp file should still be cleaned up
    expect(fs.existsSync(tempFilePath)).toBe(false);
    // No DB update should have been made
    const persisted = await prisma.user.findUnique({
      where: { id: testUser.id },
    });
    expect(persisted!.avatarUrl).toBeNull();
  });
});
