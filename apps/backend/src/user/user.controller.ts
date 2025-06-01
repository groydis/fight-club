import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../common/guards/auth.guard';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

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
