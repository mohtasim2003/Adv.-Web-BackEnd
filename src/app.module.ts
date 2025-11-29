import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AdminModule } from './admin/admin.module';
//import { EmployeeModule } from './employee/employee.module';
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
  


    
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
