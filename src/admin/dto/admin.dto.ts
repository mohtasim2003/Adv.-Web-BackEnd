import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class AdminDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}