import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  Body,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from './services/update-user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { User } from '@prisma/client';
import { UpdateUserAvatarService } from './services/update-user-avatar.service';
import { GetUserService } from './services/get-user.service';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly updateUserAvatarService: UpdateUserAvatarService,
  ) {}

  @Get()
  async getUser(@Req() req: { user?: { local?: User } }) {
    const currentUser = req.user?.local;
    if (!currentUser) {
      throw new ForbiddenException(
        'Must be authenticated to fetch user profile',
      );
    }
    const user = await this.getUserService.excute(currentUser.id);
    return { user };
  }

  @Patch(':id')
  updateUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = req.user?.local;
    if (user?.id !== id) {
      throw new ForbiddenException('Cannot edit another user’s profile.');
    }

    const updateData: {
      username?: string;
      name?: string;
      email?: string;
      bio?: string;
    } = {};

    if (dto.username !== undefined) {
      const PROFANITY_REGEX = /(fuck|shit|bitch|damn)/i;
      if (PROFANITY_REGEX.test(dto.username)) {
        throw new BadRequestException('Username contains disallowed words.');
      }
      updateData.username = dto.username.trim();
    }

    if (dto.name !== undefined) {
      updateData.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      updateData.email = dto.email.toLowerCase().trim();
    }

    if (dto.bio !== undefined) {
      updateData.bio = dto.bio.trim();
    }

    if (
      updateData.username === undefined &&
      updateData.name === undefined &&
      updateData.email === undefined &&
      updateData.bio === undefined
    ) {
      throw new BadRequestException('No valid fields provided for update.');
    }
    return this.updateUserService.excute(id, updateData);
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          // Generate a random filename
          const ext = path.extname(file.originalname).toLowerCase();
          const filename = `${uuidv4()}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only JPEG/PNG/GIF images allowed'),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  async uploadUserAvatar(
    @Req() req: { user?: { local?: User } },
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 1) Ensure the user is authenticated and we have a local profile
    const currentUser = req.user?.local;
    if (!currentUser) {
      throw new BadRequestException('Must be authenticated to upload avatar');
    }

    // 2) Ensure a file was provided
    if (!file) {
      throw new BadRequestException('No file provided for avatar');
    }

    // 3) Delegate to the service
    const publicUrl = await this.updateUserAvatarService.execute(
      currentUser.id,
      file.filename,
      file.originalname,
      file.mimetype,
    );

    // 4) Return the new URL
    return { avatarUrl: publicUrl };
  }
}
