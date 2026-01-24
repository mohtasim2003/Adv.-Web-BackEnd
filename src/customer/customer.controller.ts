// src/customer/customer.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Delete,
  Res,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { CustomerGuard } from "./auth/customer.guard";
import { Response } from "express";

@Controller("customer")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  // PUBLIC - NO GUARD NEEDED
  @Post("register")
  @UsePipes(ValidationPipe)
  register(@Body() dto: RegisterCustomerDto) {
    return this.service.registerCustomer(dto);
  }

  // @Post('login')
  // @UsePipes(ValidationPipe)
  // async login(@Body() dto: LoginCustomerDto, @Res({ passthrough: true }) res) {
  //   const result = this.service.loginCustomer(dto);

  //   // Set HTTP ONLY COOKIE
  //   res.cookie('accessToken', (await result).access_token, {
  //     httpOnly: true,
  //     sameSite: 'strict',
  //     secure: false,
  //     path: '/',
  //     maxAge: 24 * 60 * 60 * 1000,
  //   });


  //   return {
  //     message: 'Login success',
  //     user: (await result).user,
  //   };
  // }

  @Post('login')
      @UsePipes(new ValidationPipe())
      async login(@Body() body: LoginCustomerDto, @Res() res: Response): Promise<object> {
          const result = await this.service.login(body.email, body.password);
          if (result && result['accessToken']) {
              return res.status(200).json(result);
          } else {
              return res.status(401).json({ message: 'Login failed' });
          }
      }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    res.clearCookie('userid', { path: '/' });
    res.clearCookie('userRole', { path: '/' });
    return { message: 'Logged out successfully' };

  }

  // PROTECTED - ONLY CUSTOMER WITH VALID JWT
  @UseGuards(CustomerGuard)
  @Post("bookings")
  createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.service.createBooking(req.user.sub, dto);
  }

  @UseGuards(CustomerGuard)
  @Get("bookings")
  getMyBookings(@Req() req) {
    return this.service.getMyBookings(req.user.sub);
  }

  @UseGuards(CustomerGuard)
  @Get("bookings/:id")
  getBooking(@Req() req, @Param("id", ParseUUIDPipe) id: string) {
    return this.service.getBooking(req.user.sub, id);
  }

  @UseGuards(CustomerGuard)
  @Delete("bookings/:id")
  deleteBooking(@Req() req, @Param("id", ParseUUIDPipe) id: string) {
    return this.service.deleteBooking(req.user.sub, id);
  }

  @UseGuards(CustomerGuard)
  @Get("me")
  getProfile(@Req() req) {
    return this.service.getProfile(req.user.sub);
  }

  @UseGuards(CustomerGuard)
  @Put("me")
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.sub, dto);
  }
  
  @UseGuards(CustomerGuard)
  @Delete("me/:id")
  deleteProfile(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.deleteProfile(id);
  }

  @Get("getallflight")
  async getAllFlight(): Promise<object> {
    return this.service.getAllFlight();
  }
}
