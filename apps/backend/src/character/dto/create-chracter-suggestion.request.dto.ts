import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  CharacterAlignment,
  CharacterGender,
} from '../../common/types/character.types';

export class CreateCharacterSuggestionRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsEnum(CharacterGender)
  gender: CharacterGender;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsEnum(CharacterAlignment)
  alignment: CharacterAlignment;
}
