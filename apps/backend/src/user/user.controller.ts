import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/user')
export class UserController {
  @Get()
  getUser(@Req() req: Request) {
    const user = req.user?.local;
    console.log({ user });
    return { user };
  }
}
