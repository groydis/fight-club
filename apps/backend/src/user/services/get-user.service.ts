// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class GetUserService {
  constructor(private readonly prisma: PrismaService) {}

  async excute(id: string): Promise<User> {
    return await this.prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
