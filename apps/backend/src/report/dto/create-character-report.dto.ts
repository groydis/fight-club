import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { CharacterReportReason } from '../../common/types/report.types';

export class CreateCharacterReportDto {
  @IsUUID()
  characterId: string;

  @IsEnum(CharacterReportReason)
  reason: CharacterReportReason;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  detail: string;
}
