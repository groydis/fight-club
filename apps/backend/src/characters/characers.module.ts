import { Module } from '@nestjs/common';
import { CharactersController } from './character.controller';
import { CharactersService } from './character.service';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
