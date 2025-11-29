// src/customer/dto/login-customer.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCustomerDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}