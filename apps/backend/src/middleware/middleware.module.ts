// src/middleware/middleware.module.ts
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SupabaseAuthMiddleware } from '../auth/supabase-auth.middleware';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule], // ✅ This is required so SupabaseService is available
})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SupabaseAuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
