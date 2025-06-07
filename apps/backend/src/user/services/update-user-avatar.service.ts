// src/users/user-avatar.service.ts

import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { FileStorage } from '../../services/storage/interfaces/file-storage.interface';
import { FILE_STORAGE } from '../../common/tokens';
import { PrismaService } from '../../services/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '@prisma/client';

@Injectable()
export class UpdateUserAvatarService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
  ) {}

  /**
   * Handles the entire avatar‐upload workflow:
   *  1) Read the local temp file
   *  2) Push it to the storage backend via FileStorage.upload(...)
   *  3) Delete the local temp file
   *  4) Update the user's avatarUrl in the database
   *  5) Return the new avatarUrl
   */
  async execute(
    userId: string,
    tempFilename: string,
    originalName: string,
    contentType: string,
  ): Promise<User> {
    // tempFilename is just the filename in "uploads/avatars"
    const tempPath = path.join('uploads/avatars', tempFilename);

    // 1) Read the file buffer
    let buffer: Buffer;
    try {
      buffer = fs.readFileSync(tempPath);
    } catch (err: any) {
      throw new BadRequestException(
        `Unable to read uploaded file: , ${err.message}`,
      );
    }

    // 2) Build the path that will live in Supabase (or MockFileStorage)
    const ext = path.extname(originalName).toLowerCase();
    const uploadPath = `user-${userId}/avatar${ext}`;

    // 3) Delegate to FileStorage to actually upload it
    let publicUrl: string;
    try {
      publicUrl = await this.fileStorage.upload(
        uploadPath,
        buffer,
        contentType,
      );
    } catch (err: any) {
      // Always delete the temp file on failure
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // ignore any error
      }
      throw new BadRequestException(`File upload failed: ${err.message}`);
    }

    // 4) Delete the local temp file
    try {
      fs.unlinkSync(tempPath);
    } catch {
      // ignore any error here
    }

    // 5) Update the user record in the DB
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: publicUrl },
      select: { avatarUrl: true },
    });

    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    // 6) Return the new URL
    return user;
  }
}
