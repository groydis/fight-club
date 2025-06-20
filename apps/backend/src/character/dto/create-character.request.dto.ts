import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsIn,
  IsDefined,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CharacterAlignment,
  CharacterGender,
} from '../../common/types/character.types';

const STAT_NAMES = [
  'strength',
  'agility',
  'intelligence',
  'charisma',
  'luck',
  'constitution',
] as const;
type StatName = (typeof STAT_NAMES)[number];

export class StatBlock {
  @IsInt()
  @Min(0)
  @Max(10)
  strength: number;

  @IsInt()
  @Min(0)
  @Max(10)
  agility: number;

  @IsInt()
  @Min(0)
  @Max(10)
  intelligence: number;

  @IsInt()
  @Min(0)
  @Max(10)
  charisma: number;

  @IsInt()
  @Min(0)
  @Max(10)
  luck: number;

  @IsInt()
  @Min(0)
  @Max(10)
  constitution: number;
}

export class CharacterMoveDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(STAT_NAMES)
  primaryStat: StatName;
}

export class CreateCharacterDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(CharacterGender)
  gender: CharacterGender;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsEnum(CharacterAlignment)
  alignment: CharacterAlignment;

  @IsDefined()
  @ValidateNested()
  @Type(() => StatBlock)
  stats: StatBlock;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterMoveDto)
  basicMoves: CharacterMoveDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CharacterMoveDto)
  specialMoves: CharacterMoveDto[];
}
