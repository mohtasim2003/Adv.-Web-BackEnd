import * as dotenv from 'dotenv';
dotenv.config();
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAircraftDto } from './dto/aircraft.dto';
import { Aircraft } from 'src/shared/entities/aircraft.entity';
import { User, UserRole } from 'src/shared/entities/user.entity';
import { CreateFlightDto, UpdateFlightDto, } from './dto/flight.dto';
import { UpdateAircraftDto } from './dto/aircraft.dto';
import { Flight } from 'src/shared/entities/flight.entity';
import { EmployeeDto } from './dto/employee.dto';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { BeamsService } from './beams.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    @InjectRepository(Aircraft)
    private AircraftRepository: Repository<Aircraft>,
    @InjectRepository(Flight)
    private FlightRepository: Repository<Flight>,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private beamsService: BeamsService,
  ) {}

  async login(email: string, password: string): Promise<object> {
    const user = await this.UserRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new HttpException('ID not found', HttpStatus.NOT_FOUND);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      let role = user.role;
      let id = user.id;
      if (!role) {
        throw new HttpException('Not an user', HttpStatus.FORBIDDEN);
      }
      if (role === 'admin') {
        this.beamsService
          .sendAdminLoginNotification(user.email)
          .catch((err) => console.error('Beams failed:', err));
      }
      const payload = { email: user.email, role: user.role, sub: user.id };
      const token = this.jwtService.sign(payload);

      /*try {
      await this.mailerService.sendMail({
        to: admin.email,
        subject: "Admin Login Notification",
        text: `You have successfully logged in as an admin. Access Time: ${new Date().toISOString()}`,
      });
      } catch (error) {
        console.error('Mailer failed:', error);  // Or throw HttpException if you want, but keep login success
        }*/
      return { accessToken: token, role: role, id: id };
    } else {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  }

  async register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<object> {
    const existingAdmin = await this.UserRepository.findOne({
      where: { email: email },
    });
    if (existingAdmin) {
      throw new HttpException(
        'Admin with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    if (password !== confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt();
    const admin = new User();
    admin.email = email;
    admin.password = await bcrypt.hash(password, salt);
    admin.role = UserRole.ADMIN;
    try {
      const res = await this.UserRepository.save(admin);
      return res;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpException(
          'Admin with this email already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAircraft(aircraftData: CreateAircraftDto): Promise<object> {
    const existing = await this.AircraftRepository.findOne({
      where: { registration: aircraftData.registration },
    });
    if (existing) {
      throw new HttpException(
        'Aircraft with this registration already exists',
        HttpStatus.CONFLICT,
      );
    }

    if (
      !aircraftData.model ||
      !aircraftData.registration ||
      !aircraftData.capacity ||
      !aircraftData.status
    ) {
      throw new HttpException(
        'Missing required aircraft data',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (aircraftData.capacity < 1) {
      throw new HttpException(
        'Capacity must be at least 1',
        HttpStatus.BAD_REQUEST,
      );
    }

    const aircraft = new Aircraft();
    aircraft.model = aircraftData.model;
    aircraft.registration = aircraftData.registration;
    aircraft.capacity = aircraftData.capacity;
    aircraft.status = aircraftData.status;

    return this.AircraftRepository.save(aircraft);
  }

  async updateAircraft(
    id: string,
    aircraftData: UpdateAircraftDto,
  ): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id: id },
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }
    await this.AircraftRepository.update(id, aircraftData);
    return this.AircraftRepository.find({ where: { id: id } });
  }

  async deleteAircraft(id: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id },
      relations: ['flights'],
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }
    if (aircraft.flights && aircraft.flights.length > 0) {
      throw new HttpException(
        'Cannot delete aircraft with assigned flights',
        HttpStatus.CONFLICT,
      );
    }
    await this.AircraftRepository.delete(id);
    return { message: 'Aircraft deleted successfully' };
  }

  async getAllAircraft(): Promise<object> {
    return this.AircraftRepository.find();
  }

  async getAircraftById(id: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id: id },
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }
    return aircraft;
  }

  async getActiveAircraft(): Promise<object> {
    return this.AircraftRepository.find({ where: { status: 'active' } });
  }


  async getFlightById(flightId: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({
      where: { id: flightId },
      relations: ['aircraft'],
    });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }
    // Return aircraftId along with other flight properties
    const { aircraft, ...flightData } = flight;
    return {
      ...flightData,
      aircraftId: aircraft ? aircraft.id : null,
    };
  }


  async updateFlight(id: string, flightData: UpdateFlightDto): Promise<object> {
    
    const flight = await this.FlightRepository.findOne({ where: { id: id } });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }

    let res= await this.FlightRepository.update(id, flightData);
    return this.FlightRepository.find({ where: { id: id } });
  }

  async updateAircraftStatus(id: string, status: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id: id },
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }
    aircraft.status = status;
    return this.AircraftRepository.save(aircraft);
  }

  async addFlightToAircraft(
    id: string,
    flightData: CreateFlightDto,
  ): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id: id },
      relations: ['flights'],
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }

    if (
      !flightData.flightNumber ||
      !flightData.departureTime ||
      !flightData.arrivalTime ||
      !flightData.route
    ) {
      throw new HttpException(
        'Missing required flight data',
        HttpStatus.BAD_REQUEST,
      );
    }

    const departure = new Date(flightData.departureTime);
    const arrival = new Date(flightData.arrivalTime);
    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
      throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
    }
    if (arrival <= departure) {
      throw new HttpException(
        'Arrival time must be after departure time',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (aircraft.flights && aircraft.flights.length > 0) {
      const overlap = aircraft.flights.some(
        (f) => departure < f.arrivalTime && arrival > f.departureTime,
      );
      if (overlap) {
        throw new HttpException(
          'Aircraft already has a flight scheduled during this time',
          HttpStatus.CONFLICT,
        );
      }
    }

    const flight = new Flight();
    flight.flightNumber = flightData.flightNumber;
    flight.departureTime = departure;
    flight.arrivalTime = arrival;
    flight.route = flightData.route;
    flight.aircraft = aircraft;
    flight.price = flightData.price || 0;
    flight.status = flightData.status || 'scheduled';
    return this.FlightRepository.save(flight);
  }

  async getAllFlightForAircraft(id: string): Promise<object> {
    const aircraft = await this.AircraftRepository.findOne({
      where: { id: id },
      relations: ['flights'],
    });
    if (!aircraft) {
      throw new HttpException('Aircraft not found', HttpStatus.NOT_FOUND);
    }
    if (!aircraft.flights || aircraft.flights.length === 0) {
      throw new HttpException(
        'No flights found for this aircraft',
        HttpStatus.NOT_FOUND,
      );
    }
    return aircraft.flights;
  }

  /*async addFlight(flightData: CreateFlightDto): Promise<object> {
    if (
        !flightData.flightNumber ||
        !flightData.departureTime ||
        !flightData.arrivalTime ||
        !flightData.route
    ) {
        throw new HttpException('Missing required flight data', HttpStatus.BAD_REQUEST);
    }

    const departure = new Date(flightData.departureTime);
    const arrival = new Date(flightData.arrivalTime);
    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
    }
    if (arrival <= departure) {
        throw new HttpException('Arrival time must be after departure time', HttpStatus.BAD_REQUEST);
    }

    const flight = new Flight();
    flight.flightNumber = flightData.flightNumber;
    flight.departureTime = departure;
    flight.arrivalTime = arrival;
    flight.route = flightData.route;

    return this.FlightRepository.save(flight);
}*/

  async getAllFlight(): Promise<object> {
    const flights = await this.FlightRepository.find({ relations: ['aircraft'] });
    if (!flights || flights.length === 0) {
      throw new HttpException('No flights found', HttpStatus.NOT_FOUND);
    }
    // Map aircraftId for each flight
    return flights.map(flight => ({
      ...flight,
      aircraftId: flight.aircraft?.id || null
    }));
}

  async updateFlightStatus(id: string, status: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({ where: { id: id } });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }
    flight.status = status;
    return this.FlightRepository.save(flight);
  }

  async deleteFlightFromAircraft(
    id: string,
    flightid: string,
  ): Promise<object> {
    const flight = await this.FlightRepository.findOne({
      where: { id: flightid },
      relations: ['aircraft'],
    });

    if (!flight || !flight.aircraft || flight.aircraft.id !== id) {
      throw new HttpException(
        'Flight not found for this aircraft',
        HttpStatus.NOT_FOUND,
      );
    }

    flight.aircraft = null;
    await this.FlightRepository.save(flight);

    return { message: 'Flight removed from aircraft' };
  }

  async createEmployee(employeeData: EmployeeDto): Promise<object> {
    const find = await this.UserRepository.findOne({
      where: { email: employeeData.email },
    });
    if (find) {
      throw new HttpException(
        'Employee with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const salt = await bcrypt.genSalt();
    const employee = new User();
    employee.email = employeeData.email;
    employee.password = await bcrypt.hash(employeeData.password, salt);
    employee.role = UserRole.EMPLOYEE;
    try {
      await this.mailerService.sendMail({
        to: employeeData.email,
        subject: 'Welcome to the Team!',
        text: `You have been added as an employee. Your login email is: ${employeeData.email}. If you have any questions, please contact admin. Access Time: ${new Date().toISOString()}`,
      });
    } catch (error) {
      console.error('Mailer failed:', error);
    }
    return this.UserRepository.save(employee);
  }

  async getAllEmployee(): Promise<object> {
    return this.UserRepository.find({ where: { role: UserRole.EMPLOYEE } });
  }

  async updateEmployeeStatus(id: string, isActive: boolean): Promise<object> {
    const employee = await this.UserRepository.findOne({
      where: { id: id, role: UserRole.EMPLOYEE },
    });
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }
    employee.isActive = isActive;
    return this.UserRepository.save(employee);
  }

  async deleteEmployee(id: string): Promise<object> {
    const employee = await this.UserRepository.findOne({
      where: { id: id, role: UserRole.EMPLOYEE },
    });
    if (!employee) {
      throw new HttpException('Employee not found', HttpStatus.NOT_FOUND);
    }
    await this.UserRepository.delete(id);
    return { message: 'Employee deleted successfully' };
  }

  async assignEmployeeToFlight(
    flightId: string,
    employeeId: string,
  ): Promise<object> {
    // Load the crew relation to avoid overwriting existing crew
    const flight = await this.FlightRepository.findOne({
      where: { id: flightId },
      relations: ['crew'],
    });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }
    const employee = await this.UserRepository.findOne({
      where: { id: employeeId, role: UserRole.EMPLOYEE },
    });
    if (!employee) {
      return { message: 'Employee not found' };
    }
    if (!flight.crew) {
      flight.crew = [];
    }
    // Prevent duplicate assignment
    if (!flight.crew.some((e) => e.id === employee.id)) {
      flight.crew.push(employee);
    }
    try {
      await this.mailerService.sendMail({
        to: employee.email,
        subject: 'Flight Assignment Notification',
        text: `You have been assigned to flight ${flight.flightNumber} departing at ${flight.departureTime.toISOString()}. Please prepare accordingly.`,
      });
    } catch (error) {
      console.error('Mailer failed:', error);
    }
    return this.FlightRepository.save(flight);
  }

  async getFlightCrew(flightId: string): Promise<object> {
    const flight = await this.FlightRepository.findOne({
      where: { id: flightId },
      relations: ['crew'],
    });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }
    return flight.crew;
  }

  async removeEmployeeFromFlight(
    flightId: string,
    employeeId: string,
  ): Promise<object> {
    const flight = await this.FlightRepository.findOne({
      where: { id: flightId },
      relations: ['crew'],
    });
    if (!flight) {
      throw new HttpException('Flight not found', HttpStatus.NOT_FOUND);
    }
    flight.crew = (flight.crew || []).filter((e) => e.id !== employeeId);
    return this.FlightRepository.save(flight);
  }
}
