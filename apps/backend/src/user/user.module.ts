import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { AuthGuard } from '../auth/auth.guard';
import { PrismaModule } from '../services/prisma/prisma.module';
import { UpdateUserService } from './services/update-user.service';
import { UpdateUserAvatarService } from './services/update-user-avatar.service';
import { FileStorageModule } from '../services/storage/file-storage.module';

@Module({
  imports: [PrismaModule, SupabaseModule, FileStorageModule],
  controllers: [UserController],
  providers: [AuthGuard, UpdateUserAvatarService, UpdateUserService],
})
export class UserModule {}
