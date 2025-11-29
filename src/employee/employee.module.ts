import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Booking } from '../shared/entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Passenger } from '../shared/entities/passenger.entity';
import { Flight } from '../shared/entities/flight.entity';
import { User } from '../shared/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Payment, Passenger, Flight, User])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}