import {
  UseGuards,
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCharacterSuggestionRequestDto } from './dto/create-chracter-suggestion.request.dto';
import { CreateCharacterSuggestionService } from './services/create-character-suggestion.service';
import { CreateCharacterDto } from './dto/create-character.request.dto';
import { AuthenticatedRequest } from '../common/types/extended-request';
import { CreateCharacterService } from './services/create-character.service';
import { GetCharacterService } from './services/get-character.service';
import { DeleteCharacterService } from './services/delete-character.service';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('api/character')
export class CharacterController {
  constructor(
    private readonly getCharacterService: GetCharacterService,
    private readonly createCharacterSuggestionService: CreateCharacterSuggestionService,
    private readonly createCharacterService: CreateCharacterService,
    private readonly deleteCharacterService: DeleteCharacterService,
  ) {}

  @Public()
  @Get()
  get(@Query('id') characterId: string) {
    if (!characterId) {
      throw new BadRequestException('Character ID is required');
    }
    return this.getCharacterService.execute(characterId);
  }

  @Post()
  create(@Body() dto: CreateCharacterDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.local?.id;
    if (!userId) {
      throw new BadRequestException('Missing user information');
    }

    const total = (Object.values(dto.stats) as number[]).reduce(
      (sum, val) => sum + val,
      0,
    );

    if (total !== 30) {
      throw new BadRequestException('Total stat points must equal 30');
    }

    return this.createCharacterService.execute(dto, userId);
  }

  @Delete()
  delete(@Req() req: AuthenticatedRequest, @Query('id') characterId: string) {
    const userId = req.user?.local?.id;
    if (!userId) {
      throw new BadRequestException('Missing user information');
    }
    if (!characterId) {
      throw new BadRequestException('Character ID is required');
    }
    return this.deleteCharacterService.execute(userId, characterId);
  }

  @Post('suggestion')
  createCharacterSuggestion(@Body() dto: CreateCharacterSuggestionRequestDto) {
    return this.createCharacterSuggestionService.execute(dto);
  }
}
