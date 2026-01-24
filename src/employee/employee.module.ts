import * as dotenv from "dotenv";
dotenv.config();
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { Booking } from "../shared/entities/booking.entity";
import { Payment } from "./entities/payment.entity";
import { Passenger } from "../shared/entities/passenger.entity";
import { Flight } from "../shared/entities/flight.entity";
import { User } from "../shared/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RoleGuard } from "./auth/role.guard";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    TypeOrmModule.forFeature([Booking, Payment, Passenger, Flight, User]),
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.ADMIN_MAIL,
          pass: process.env.ADMIN_MAIL_PASSWORD,
        },
      },
    }),
  ],

  providers: [EmployeeService, JwtAuthGuard, RoleGuard],
  controllers: [EmployeeController],
  exports: [EmployeeService, JwtAuthGuard, RoleGuard, MailerModule],
})
export class EmployeeModule {}
