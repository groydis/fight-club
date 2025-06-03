import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [UserController],
  providers: [AuthGuard],
})
export class UserModule {}
