import { IsOptional, IsString } from "class-validator";

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  status?: string;
}
