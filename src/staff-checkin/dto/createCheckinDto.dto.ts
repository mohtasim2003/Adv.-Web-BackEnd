// src/user/dto/create-user.dto.ts
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  country?: string;
}