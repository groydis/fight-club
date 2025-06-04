import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { SupabaseModule } from '../services/supabase/supabase.module';
import { PrismaModule } from '../services/prisma/prisma.module';
import { ListCharactersService } from './services/list-characters.service';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [CharactersController],
  providers: [ListCharactersService],
})
export class CharactersModule {}
