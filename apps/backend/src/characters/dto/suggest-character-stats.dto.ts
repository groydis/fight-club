import { IsString, MinLength } from 'class-validator';

export class SuggestCharacterStatsDto {
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;
}
