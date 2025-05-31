import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../common/types/extended-request';

@Controller('api/user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req: AuthenticatedRequest) {
    return {
      message: 'User authenticated',
      user: req.user,
    };
  }
}
