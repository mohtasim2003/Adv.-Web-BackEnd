import { IsString, IsInt, Min } from 'class-validator';
//import transformer from 'class-transformer';
import { Type } from 'class-transformer';

export class CreateAircraftDto {
    @IsString()
    model: string;

    @IsString()
    registration: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsString()
    status: string;
}