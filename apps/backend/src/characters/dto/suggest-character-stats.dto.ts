import { IsNotEmpty, IsString } from 'class-validator';

export class SuggestCharacterStatsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
