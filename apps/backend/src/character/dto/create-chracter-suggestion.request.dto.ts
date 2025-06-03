import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCharacterSuggestionRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
