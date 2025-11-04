import { Module } from '@nestjs/common';
import { StaffCheckinController } from './staff-checkin.controller';
import { StaffCheckinService } from './staff-checkin.service';

@Module({
  controllers: [StaffCheckinController],
  providers: [StaffCheckinService],
})
export class StaffCheckinModule {}