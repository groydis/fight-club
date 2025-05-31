import { Injectable } from '@nestjs/common';
import { SuggestCharacterStatsDto } from './dto/suggest-character-stats.dto';

@Injectable()
export class CharactersService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  suggestStats(_dto: SuggestCharacterStatsDto) {
    return {
      stats: {
        strength: 5,
        agility: 5,
        intelligence: 5,
        charisma: 5,
      },
      moves: [
        { name: 'Placeholder Move 1', description: 'Does something cool.' },
        {
          name: 'Placeholder Move 2',
          description: 'Also does something cool.',
        },
      ],
    };
  }
}
