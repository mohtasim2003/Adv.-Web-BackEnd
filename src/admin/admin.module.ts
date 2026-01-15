import * as dotenv from "dotenv";
dotenv.config();
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
//import { AdminLogin } from './dto/admin.entity';

import { AdminService } from "./admin.service";
import { User } from "src/shared/entities/user.entity";
import { Aircraft } from "src/shared/entities/aircraft.entity";
import { Flight } from "src/shared/entities/flight.entity";
import { MailerModule } from "@nestjs-modules/mailer";
import { AdminController } from "./admin.controller";
import { BeamsService } from "./beams.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    TypeOrmModule.forFeature([Aircraft, User, Flight]),
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
  controllers: [AdminController],
  providers: [AdminService, BeamsService],
  exports: [AdminService, BeamsService],
})
export class AdminModule {}
