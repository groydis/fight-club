// src/middleware/middleware.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { PrismaModule } from '../services/prisma/prisma.module';

@Module({
  imports: [SupabaseModule, PrismaModule],
  providers: [
    Reflector,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MiddlewareModule {}
