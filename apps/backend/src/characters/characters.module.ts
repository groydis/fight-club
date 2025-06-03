import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ListCharactersService } from './services/list-characters.service';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [CharactersController],
  providers: [ListCharactersService],
})
export class CharactersModule {}
