import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCheckinDto {   // ✅ must be exported
  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsString()
  @IsOptional()
  status?: string;
}