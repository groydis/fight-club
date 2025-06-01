import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthGuard } from '../common/guards/auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [UserController],
  providers: [AuthGuard],
})
export class UserModule {}
