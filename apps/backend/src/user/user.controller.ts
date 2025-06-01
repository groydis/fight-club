import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('api/user')
export class UserController {
  @UseGuards(AuthGuard)
  @Get()
  getUser(@Req() req) {
    return {
      message: 'User authenticated',
      user: req.user,
    };
  }
}
