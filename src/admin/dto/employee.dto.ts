import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class EmployeeDto {
    @IsEmail()
    mail: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}