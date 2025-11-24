import { Module } from '@nestjs/common';
import { StaffCheckinController } from './staff-checkin.controller';
import { StaffCheckinService } from './staff-checkin.service';
import { StaffCheckinEntity } from './Staff-checkinEntity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([StaffCheckinEntity]),],
  controllers: [StaffCheckinController],
  providers: [StaffCheckinService],
})
export class StaffCheckinModule {}