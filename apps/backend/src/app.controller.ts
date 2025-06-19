import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('/healthz')
  getHealth(): string {
    return 'OK';
  }
}
