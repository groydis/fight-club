import { IsString, MinLength } from 'class-validator';

export class SuggestCharacterStatsDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;
}
