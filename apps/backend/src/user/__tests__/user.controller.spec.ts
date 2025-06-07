import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserController } from '../user.controller';
import { AuthGuard } from '../../auth/auth.guard';
import { AllowAllAuthGuard, local } from '../../test-utils/mock-auth.guard';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SupabaseModule } from '../../services/supabase/supabase.module';
import { faker } from '@faker-js/faker';
import { PrismaService } from '../../services/prisma/prisma.service';
import { UpdateUserService } from '../services/update-user.service';
import { STATIC_USERS } from '../../test-utils/static.users';
import { UpdateUserAvatarService } from '../services/update-user-avatar.service';
import { FileStorageModule } from '../../services/storage/file-storage.module';
import { GetUserService } from '../services/get-user.service';

describe('UserController (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule, PrismaModule, FileStorageModule],
      providers: [
        PrismaService,
        GetUserService,
        UpdateUserService,
        UpdateUserAvatarService,
      ],
      controllers: [UserController],
    })
      .overrideGuard(AuthGuard)
      .useClass(AllowAllAuthGuard)
      .compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('GET /api/user', () => {
    it('should return the user info if authenticated', async () => {
      const server = app.getHttpServer() as import('http').Server;
      const res = await request(server).get('/api/user');

      expect(res.status).toBe(200);
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(local.id);
      // TODO: hard to test thorougly, but we should at least
      // check the shape of the body is correct
    });
  });

  describe('PATCH /api/user', () => {
    const testUserIds: string[] = [];
    const validUpdate = {
      username: faker.internet.userName(),
      name: faker.person.firstName(),
      email: faker.internet.exampleEmail(),
      bio: faker.person.bio(),
    };

    afterAll(async () => {
      await prisma.user.deleteMany({
        where: { id: { in: testUserIds } },
      });
    });

    it('successfully updates username, name, email, and bio', async () => {
      const existing = await prisma.user.findUniqueOrThrow({
        where: { id: STATIC_USERS.activeUser1 },
      });

      const server = app.getHttpServer() as import('http').Server;
      const res = await request(server).patch(`/api/user`).send(validUpdate);

      expect(res.status).toBe(200);
      const updated = res.body;

      expect(updated.id).toBe(STATIC_USERS.activeUser1);
      expect(updated.username.toLowerCase()).toBe(
        validUpdate.username.toLowerCase(),
      );
      expect(updated.name.toLowerCase()).toBe(validUpdate.name.toLowerCase());
      expect(updated.email.toLowerCase()).toBe(validUpdate.email.toLowerCase());
      expect(updated.bio.toLowerCase()).toBe(validUpdate.bio.toLowerCase());

      // Verify persistence in the database
      const persisted = await prisma.user.findUniqueOrThrow({
        where: { id: STATIC_USERS.activeUser1 },
      });

      expect(persisted).not.toBeNull();
      expect(persisted.username).not.toBe(existing.username);
      expect(persisted.name).not.toBe(existing.name);
      expect(persisted.email).not.toBe(existing.email);
      expect(persisted.bio).not.toBe(existing.bio);
    });

    it('throws BadRequestException if request body is empty', async () => {
      const server = app.getHttpServer();
      const res = await request(server).patch(`/api/user`).send({});

      expect(res.status).toBe(400);
    });

    it('throws BadRequestException if username contains profanity', async () => {
      const server = app.getHttpServer();
      const res = await request(server)
        .patch(`/api/user`)
        .send({ username: 'fuck' });

      expect(res.status).toBe(400);
    });

    // it('throws ForbiddenException if attempting to update user id that is not yours', async () => {
    //   const testUser = await createMockAuthUser(prisma);
    //   testUserIds.push(testUser.id);
    //   const server = app.getHttpServer();
    //   const res = await request(server)
    //     .patch(`/api/user/${testUser.id}`)
    //     .send({ username: 'fuck' });

    //   expect(res.status).toBe(403);
    // });
  });
});
