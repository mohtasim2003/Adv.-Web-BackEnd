// src/customer/dto/register-customer.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  @IsNotEmpty()
  name: string;
  
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}