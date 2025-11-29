import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Booking } from 'src/shared/entities/booking.entity';
import { Flight } from 'src/shared/entities/flight.entity';
import { Payment } from 'src/shared/entities/payment.entity';
import { User } from 'src/shared/entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Passenger } from '../shared/entities/passenger.entity';
import { JwtModule } from '@nestjs/jwt';
import { CustomerGuard } from './auth/customer.guard';
// import { Booking } from '../shared/entities/booking.entity';
// import { Flight } from '../shared/entities/flight.entity';
// import { Passenger } from './entities/passenger.entity';
// import { Payment } from '../shared/entities/payment.entity';
// import { User } from '../shared/entities/user.entity';
// import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Flight, Passenger, Payment, User, Profile]), JwtModule.register({
    secret: 'secret123',
    signOptions: {expiresIn: '24h'},
  })],
  controllers: [CustomerController],
  providers: [CustomerService,CustomerGuard],
})
export class CustomerModule {}
