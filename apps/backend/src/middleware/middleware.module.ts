// src/middleware/middleware.module.ts
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SupabaseAuthMiddleware } from '../auth/supabase-auth.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SupabaseAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
