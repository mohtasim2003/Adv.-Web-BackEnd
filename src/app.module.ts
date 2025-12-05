import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AdminModule } from './admin/admin.module';
import { EmployeeModule } from './employee/employee.module';
import { CustomerModule } from './customer/customer.module';
import { MailerModule } from '@nestjs-modules/mailer';
dotenv.config();


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CERT,
      },

      extra: {
        ssl: {
          rejectUnauthorized: true,
          ca: process.env.DB_SSL_CERT,
        },
      },
    }),
  


    
    AdminModule,
    EmployeeModule,
    CustomerModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: (process.env.SMTP_SECURE === 'true'), // true for 465
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: '"Airline" <no-reply@airline.com>',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
