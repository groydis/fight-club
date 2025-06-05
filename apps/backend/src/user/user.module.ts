import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaModule } from '../services/prisma/prisma.module';
import { UpdateUserService } from './services/update-user.service';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [UserController],
  providers: [AuthGuard, UpdateUserService],
})
export class UserModule {}
