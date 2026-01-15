import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class CreateFlightDto {
  @IsString()
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  route: string;

  @IsUUID()
  aircraftId: string;
}

export class UpdateAircraftDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  registration?: string;

  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
