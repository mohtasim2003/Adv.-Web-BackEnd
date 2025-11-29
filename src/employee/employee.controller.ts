import {Controller, Post, Get, Put, Delete, Body, Param, UseGuards, ValidationPipe, ParseUUIDPipe, Patch} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { AuthGuard } from "@nestjs/passport";
import {RoleGuard} from "../employee/auth/role.guard";
import { Roles } from "../employee/auth/roles.decorator";
import { CreateBookingDto } from "../employee/dto/create-booking.dto";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { CreatePassengerDto } from "./dto/create-passenger.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { EmployeeGuard } from "./auth/employee.guard";

@Controller('employee')
@UseGuards(EmployeeGuard)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}


    @Post ('bookings')
    createBooking(@Body(new ValidationPipe({whitelist: true})) dto: CreateBookingDto) {
        return this.employeeService.createBooking(dto);
    }

    @Get('bookings')
    getAll() {
        return this.employeeService.getBookings();
    }

    @Get('bookings/:id')
    getBookingById(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.employeeService.getBooking(id);
    }

    @Put('bookings/:id')
    updateBooking(
        @Param('id', new ParseUUIDPipe()) 
        id: string,
        @Body(new ValidationPipe({whitelist: true})) 
        dto: UpdateBookingDto
    ) {
        return this.employeeService.updateBooking(id, dto);
    }

    @Patch('bookings/:id/status')
    updateBookingStatus(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body('status', new ValidationPipe({whitelist: true})) status: string
    ) {
        return this.employeeService.updateBookingStatus(id, status);
    }
    
    @Delete('bookings/:id')
    deleteBooking(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.employeeService.deleteBooking(id);
    }

    @Post('bookinga/:bookingId/payment')
    createPayment(
        @Param('bookingId', new ParseUUIDPipe()) bookingId: string,
        @Body(new ValidationPipe({whitelist: true})) dto: CreatePaymentDto
    ) {
        return this.employeeService.addPayment(bookingId, dto);
    }

     @Post('bookings/:bookingId/passengers')
  addPassengers(@Param('bookingId', ParseUUIDPipe) bookingId: string, @Body(new ValidationPipe({ whitelist: true })) passengers: CreatePassengerDto[]) {
    return this.employeeService.addPassengers(bookingId, passengers);
  }

  @Get('bookings/:bookingId/passengers')
  listPassengers(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.employeeService.listPassengers(bookingId);
  }

  @Delete('bookings/:bookingId/passengers/:passengerId')
  deletePassenger(@Param('bookingId', ParseUUIDPipe) bookingId: string, @Param('passengerId', ParseUUIDPipe) passengerId: string) {
    return this.employeeService.deletePassenger(bookingId, passengerId);
  }

  @Post('checkin')
  async checkin(@Body('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.employeeService.checkin(bookingId);
  }
}