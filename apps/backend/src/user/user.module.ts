import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Module({
  imports: [SupabaseModule],
  controllers: [UserController],
  providers: [AuthGuard],
})
export class UserModule {}
