import { IsUUID, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreatePassengerDto } from "./create-passenger.dto";
// import { CreatePassengerDto } from './create-passenger.dto';

export class CreateBookingDto {
  @IsUUID()
  flightId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  passengers: CreatePassengerDto[];

  @IsOptional()
  paymentMethod?: string;
}
