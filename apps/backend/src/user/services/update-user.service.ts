// src/users/users.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma/prisma.service';
import type { User } from '@prisma/client';

@Injectable()
export class UpdateUserService {
  constructor(private readonly prisma: PrismaService) {}

  async excute(
    id: string,
    data: {
      username?: string;
      name?: string;
      email?: string;
      bio?: string;
    },
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
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
    } catch (error: any) {
      // P2002 = unique constraint failed
      if (
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        (error.meta.target.includes('username') ||
          error.meta.target.includes('email'))
      ) {
        throw new ConflictException('Username or email already in use.');
      }
      throw error;
    }
  }
}
