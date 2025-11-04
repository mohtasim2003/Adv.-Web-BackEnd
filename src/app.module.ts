import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaffCheckinModule } from './staff-checkin/staff-checkin.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [AdminModule,UserModule,StaffCheckinModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
