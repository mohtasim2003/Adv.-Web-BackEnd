import { IsString, MinLength } from "class-validator";

export class CreatePassengerDto {
  @IsString()
  name: string;

  @IsString()
  passport: string;
}
