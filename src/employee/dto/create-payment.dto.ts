import { IsNumber, IsString, Min } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @Min(0)
    amount: number;

    @IsString()
    method: string;
}