// src/users/dto/update-user.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

// Simple profanity‐blocking regex (replace or expand as needed)
const PROFANITY_REGEX = /(fuck|shit|bitch|damn)/i;

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'Username must be 3–20 characters.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username may only contain letters, numbers, and underscores.',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Name must be 1–50 characters.' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email.' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200, { message: 'Bio cannot exceed 200 characters.' })
  bio?: string;
}
