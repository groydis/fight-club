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
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from './services/update-user.service';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Get()
  getUser(@Req() req: Request) {
    const user = req.user?.local;
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

    // 2) Username update (if provided) → profanity check
    if (dto.username !== undefined) {
      const PROFANITY_REGEX = /(fuck|shit|bitch|damn)/i;
      if (PROFANITY_REGEX.test(dto.username)) {
        throw new BadRequestException('Username contains disallowed words.');
      }
      updateData.username = dto.username.trim();
    }

    // 3) Name update (if provided)
    if (dto.name !== undefined) {
      updateData.name = dto.name.trim();
    }

    // 4) Email update (if provided)
    if (dto.email !== undefined) {
      updateData.email = dto.email.toLowerCase().trim();
    }

    // 5) Bio update (if provided)
    if (dto.bio !== undefined) {
      updateData.bio = dto.bio.trim();
    }

    // 6) Check that at least one field is actually being updated
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
}
