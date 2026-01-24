import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreatePassengerDto } from "./create-passenger.dto";

export class CreateBookingDto {
  @IsUUID()
  flightId: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  passengers?: CreatePassengerDto[];
}
