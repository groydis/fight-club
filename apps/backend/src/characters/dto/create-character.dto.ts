import {
  IsString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

const STAT_NAMES = [
  'strength',
  'agility',
  'intelligence',
  'endurance',
  'charisma',
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
  endurance: number;

  @IsInt()
  @Min(0)
  @Max(10)
  charisma: number;
}

export class CharacterMoveDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(STAT_NAMES)
  stat: StatName;
}

export class CreateCharacterDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

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
