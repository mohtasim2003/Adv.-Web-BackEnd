
import * as dotenv from 'dotenv';
dotenv.config();
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminLogin } from './dto/admin.entity';
import { CreateAircraftDto } from './dto/aircraft.dto';
import { Aircraft } from 'src/shared/entities/aircraft.entity';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { CreateFlightDto } from './dto/flight.dto';
import { Flight } from 'src/shared/entities/flight.entity';
import { EmployeeDto } from './dto/employee.dto';
import { MailerService } from '@nestjs-modules/mailer/dist';
  
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private AdminLoginRepository: Repository<User>,
    @InjectRepository(Aircraft)
    private AircraftRepository: Repository<Aircraft>,
    @InjectRepository(Flight)
    private FlightRepository: Repository<Flight>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login( email: string, password: string): Promise<object> {
    
    const admin = await this.AdminLoginRepository.findOne({ where: { email: email } });
    if (!admin) {
      return { message: 'ID not found' };
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (isPasswordValid) {
      let role = admin.role;
      if (role !== 'admin') {
        return { message: 'Not an admin user' };
      }
      const payload = { email: admin.email, role: 'admin' };
      const token = this.jwtService.sign(payload);
      await this.mailerService.sendMail({
        to: process.env.ADMIN_MAIL,
        subject: "Admin Login Notification",
        text: `You have successfully logged in as an admin. Access Time: ${new Date().toISOString()}`,
      });
      return { accessToken: token };
    } else {
      return { message: 'Invalid password' };
    }
  }

  async createAdmin(adminData: AdminLogin): Promise<object> {
    const salt = await bcrypt.genSalt();
    const admin = new User();
    admin.email = adminData.mail;
    admin.password = await bcrypt.hash(adminData.password, salt);
    admin.role = UserRole.ADMIN;
    return this.AdminLoginRepository.save(admin);
  }

  async createAircraft(aircraftData: CreateAircraftDto): Promise<object> {
    return this.AircraftRepository.save(aircraftData);
  }

  async updateAircraft(id: string, aircraftData: CreateAircraftDto): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({ where: { id: id } });
    if (!aircraft) {
      return { message: 'Aircraft not found' };
    }
    await this.AircraftRepository.update(id, aircraftData);
    return this.AircraftRepository.find({ where: { id: id } });
  }

  async deleteAircraft(id: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({ where: { id: id } });
    if (!aircraft) {
      return { message: 'Aircraft not found' };
    }
    await this.AircraftRepository.delete(id);
    return { message: 'Aircraft deleted successfully' };
  }

  async getAllAircraft(): Promise<object> {
    return this.AircraftRepository.find();
  }

  async getActiveAircraft(): Promise<object> {
    return this.AircraftRepository.find({ where: { status: 'active' } });
  }

  async updateAircraftStatus(id: string, status: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({ where: { id: id } });
    if (!aircraft) {
      return { message: 'Aircraft not found' };
    }
    aircraft.status = status;
    return this.AircraftRepository.save(aircraft);
  }

  async createFlight(flightData: CreateFlightDto): Promise<object> {
    return this.FlightRepository.save(flightData);
  }

  async getAllFlight(): Promise<object> {
    return this.FlightRepository.find();
  }

  async updateFlightStatus(id: string, status: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({ where: { id: id } });
    if (!flight) {
      return { message: 'Flight not found' };
    }
    flight.status = status;
    return this.FlightRepository.save(flight);
  }

  async deleteFlight(id: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({ where: { id: id } });
    if (!flight) {
      return { message: 'Flight not found' };
    }
    await this.FlightRepository.delete(id);
    return { message: 'Flight deleted successfully' };
  }

  async createEmployee(employeeData: EmployeeDto): Promise<object> {
    const find = await this.AdminLoginRepository.findOne({ where: { email: employeeData.mail } });
    if (find) {
      return { message: 'Employee with this email already exists' };
    }
    const salt = await bcrypt.genSalt();
    const employee = new User();
    employee.email = employeeData.mail;
    employee.password = await bcrypt.hash(employeeData.password, salt);
    employee.role = UserRole.EMPLOYEE;
    return this.AdminLoginRepository.save(employee);
  }

  async getAllEmployee(): Promise<object> {
    return this.AdminLoginRepository.find({ where: { role: UserRole.EMPLOYEE } });
  }

  async updateEmployeeStatus(id: string, isActive: boolean): Promise<object> {
    const employee = await this.AdminLoginRepository.findOne({ where: { id: id, role: UserRole.EMPLOYEE } });
    if (!employee) {
      return { message: 'Employee not found' };
    }
    employee.isActive = isActive;
    return this.AdminLoginRepository.save(employee);
  }

  async deleteEmployee(id: string): Promise<object> {
    const employee = await this.AdminLoginRepository.findOne({ where: { id: id, role: UserRole.CUSTOMER } });
    if (!employee) {
      return { message: 'Employee not found' };
    }
    await this.AdminLoginRepository.delete(id);
    return { message: 'Employee deleted successfully' };
  }

  async assignEmployeeToFlight(flightId: string, employeeId: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({ where: { id: flightId } });
    if (!flight) {
      return { message: 'Flight not found' };
    }
    const employee = await this.AdminLoginRepository.findOne({ where: { id: employeeId, role: UserRole.EMPLOYEE } });
    if (!employee) {
      return { message: 'Employee not found' };
    }
    if (!flight.crew) {
      flight.crew = [];
    }
    flight.crew.push(employee);
    return this.FlightRepository.save(flight);
  }

  async getFlightCrew(flightId: string): Promise<object> { 
    const flight = await this.FlightRepository.findOne({ where: { id: flightId }, relations: ['crew'] });
    if (!flight) {
      return { message: 'Flight not found' };
    }
    return flight.crew;
  }

  async removeEmployeeFromFlight(flightId: string, employeeId: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({ where: { id: flightId }, relations: ['crew'] });
    if (!flight) {
      return { message: 'Flight not found' };
    }
    flight.crew = flight.crew.filter(employee => employee.id !== employeeId);
    return this.FlightRepository.save(flight);
  }
}
