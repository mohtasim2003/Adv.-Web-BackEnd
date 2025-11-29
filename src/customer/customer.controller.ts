import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseUUIDPipe, Put, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Public } from './auth/public.decorator';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';

@Controller('customer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  // ── PUBLIC ROUTES ─────────────────────
  @Public()
  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() dto: RegisterCustomerDto) {
    return this.service.registerCustomer(dto);
  }

  @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() dto: LoginCustomerDto) {
    return this.service.loginCustomer(dto);
  }

  @Post('bookings')
  async createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.service.createBooking(req.user.sub, dto);
  }

  @Get('bookings')
  async getMyBookings(@Req() req) {
    return this.service.getMyBookings(req.user.sub);
  }

  @Get('bookings/:id')
  async getBooking(@Req() req, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.getBooking(req.user.sub, id);
  }

  // profile endpoints
  @Get('me')
  async getProfile(@Req() req) {
    return this.service.getProfile(req.user.sub);
  }

  @Put('me')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(req.user.sub, dto);
  }
}
