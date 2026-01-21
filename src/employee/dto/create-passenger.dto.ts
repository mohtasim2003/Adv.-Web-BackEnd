import { IsString } from "class-validator";

export class CreatePassengerDto {
  @IsString()
  name: string;

  @IsString()
  passport: string;
}
