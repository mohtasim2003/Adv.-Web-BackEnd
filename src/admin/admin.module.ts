import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminLogin } from './dto/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAircraftDto } from './dto/aircraft.dto';
import { User } from 'src/shared/entities/user.entity';
import { Aircraft } from 'src/shared/entities/aircraft.entity';
import { Flight } from 'src/shared/entities/flight.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AdminLogin, CreateAircraftDto,Aircraft, User,Flight]),],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
