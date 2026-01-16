import * as dotenv from 'dotenv';
dotenv.config();
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
import { Aircraft } from 'src/shared/entities/aircraft.entity';
import { MailerModule } from '@nestjs-modules/mailer';
// import { Booking } from '../shared/entities/booking.entity';
// import { Flight } from '../shared/entities/flight.entity';
// import { Passenger } from './entities/passenger.entity';
// import { Payment } from '../shared/entities/payment.entity';
// import { User } from '../shared/entities/user.entity';
// import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Flight, Passenger, Payment, User, Profile]), 
  JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' },
    }),

   TypeOrmModule.forFeature([Aircraft, User,Flight]),
      MailerModule.forRoot({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASSWORD,
          },
  }}),

],
  controllers: [CustomerController],
  providers: [CustomerService,CustomerGuard],
})
export class CustomerModule {}
