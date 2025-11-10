import { IsNotEmpty, IsNumberString, Matches, MinLength } from 'class-validator';


export class AdminDTO {

    id: number;

    @Matches(/^[a-zA-Z0-9 ]+$/, { message: 'Name must not contain any special character' })
    name: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase character' })
    password: string;

    @IsNumberString()
    @Matches(/^01/, { message: 'Phone Number must start with 01' })
    phone: string;

    filename: string;
}