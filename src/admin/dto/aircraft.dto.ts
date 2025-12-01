import { IsString, IsInt, Min, IsOptional } from 'class-validator';
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

export class UpdateAircraftStatusDto {
    @IsOptional()
    @IsString()
    status: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    capacity: number;

    @IsOptional()
    @IsString()
    model: string;

    @IsOptional()
    @IsString()
    registration: string;
}