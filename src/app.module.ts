import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffCheckinModule } from './staff-checkin/staff-checkin.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AdminModule,UserModule,StaffCheckinModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '12345678',
    database: 'Airline_Management_System',
    autoLoadEntities: true,
    synchronize: true,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
