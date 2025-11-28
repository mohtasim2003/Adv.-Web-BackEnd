import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AdminLogin } from './dto/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateAircraftDto } from './dto/aircraft.dto';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AdminLogin, CreateAircraftDto]),],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
