import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminLogin } from './dto/admin.entity';
import { CreateAircraftDto } from './dto/aircraft.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminLogin)
    private AdminLoginRepository: Repository<AdminLogin>,
    @InjectRepository(CreateAircraftDto)
    private AircraftRepository: Repository<CreateAircraftDto>,
    private jwtService: JwtService,
  ) {}

  async login( email: string, password: string): Promise<object> {
    
    const admin = await this.AdminLoginRepository.findOne({ where: { mail: email } });
    if (!admin) {
      return { message: 'Admin not found' };
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (isPasswordValid) {
      const payload = { mail: admin.mail, role: 'admin' };
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    } else {
      return { message: 'Invalid password' };
    }
  }

  
  async createAdmin(adminData: AdminLogin): Promise<AdminLogin> {
    const salt = await bcrypt.genSalt();
    const admin = new AdminLogin();
    admin.mail =adminData.mail;
    admin.password = await bcrypt.hash(adminData.password, salt);
    return this.AdminLoginRepository.save(admin);
  }

  async createAircraft(aircraftData: CreateAircraftDto): Promise<object> {
    return this.AircraftRepository.save(aircraftData);
  }

}
