import { IsEmail, IsString } from "class-validator";

export class LoginEmployeeDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
