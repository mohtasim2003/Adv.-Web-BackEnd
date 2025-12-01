import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../shared/entities/booking.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Passenger } from '../shared/entities/passenger.entity';
import { Payment } from './entities/payment.entity';
import { Flight } from '../shared/entities/flight.entity';
import { User, UserRole } from '../shared/entities/user.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { LoginEmployeeDto } from './dto/login-employee.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Passenger) private passengerRepo: Repository<Passenger>,
    private dataSource: DataSource,
    @InjectRepository(Flight) private flightRepo: Repository<Flight>,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailerService: MailerService,
  ) {}

//registration and Login
  async registerEmployee(dto: CreateEmployeeDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email }
    });

    if (existing) {
      throw new BadRequestException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const employee = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.EMPLOYEE
    });

    await this.userRepo.save(employee);

    return {
      message: "Employee registered successfully",
      employeeId: employee.id
    };
  }

  async loginEmployee(dto: LoginEmployeeDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email }
    });

    if (!user || user.role !== 'employee') {
      throw new UnauthorizedException("Invalid credentials");
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    return {
      message: "Login successful",
      token
    };
  }

// Booking Management
  async createBooking(dto: CreateBookingDto) {
    const flight = await this.flightRepo.findOne({ where: { id: dto.flightId }});
    if (!flight) throw new NotFoundException('Flight not found');
    const customer = await this.userRepo.findOne({ where: { id: dto.customerId }});
    if (!customer) throw new NotFoundException('Customer not found');

    // Transaction: create booking + passengers
    return await this.dataSource.transaction(async manager => {
      const booking = manager.create(Booking, { flight, customer });
      const savedBooking = await manager.save(Booking, booking);

      if (dto.passengers?.length) {
        const passengers = dto.passengers.map(p => manager.create(Passenger, { ...p, booking: savedBooking }));
        await manager.save(Passenger, passengers);
      }
      return manager.findOne(Booking, { where: { id: savedBooking.id }, relations: ['passengers', 'flight', 'customer', 'payment'] });
    });
  }

  async addPayment(bookingId: string, dto: CreatePaymentDto) {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId },
      relations: ['customer', 'flight', 'passengers']
     });
    if (!booking) throw new NotFoundException('Booking not found');

    // Use transaction to attach payment
    return await this.dataSource.transaction(async manager => {
      const payment = manager.create(Payment, { ...dto, booking });
      const saved = await manager.save(payment);
      booking.payment = saved;
      await manager.save(Booking, booking);
      // optional: set booking.status = 'paid'
      booking.status = 'paid';
      await manager.save(Booking, booking);

      //send email
      await this.sendticketEmail(booking.customer.email, booking);

      return {
        message: "Payment Successful. Ticket sent to customer email",
        bookingId: booking.id,
        payment: saved

      }; 
    });
  }

  async getBookings() {
    return this.bookingRepo.find();
  }

  async getBooking(id: string) {
    const b = await this.bookingRepo.findOne({ where: { id }});
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  async updateBooking(id: string, dto: Partial<Booking>) {
    await this.bookingRepo.update(id, dto);
    return this.getBooking(id);
  }

  async deleteBooking(id: string) {
    const res = await this.bookingRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Booking not found');
    return { deleted: true };
  }

  async addPassengers(bookingId: string, passengers: CreatePassengerDto[]) {
    const booking = await this.getBooking(bookingId);
    const created = passengers.map(p => this.passengerRepo.create({ ...p, booking }));
    return this.passengerRepo.save(created);
  }

  async updateBookingStatus(id: string, status: string) {
    const booking = await this.bookingRepo.findOne({ where: { id }});
    if (!booking) throw new NotFoundException('Booking not found');
    const allowed =['Pending', 'paid', 'checked-in', 'cancelled'];
    if (!allowed.includes(status)) {
        throw new BadRequestException('Invalid status value: ${status}');
    }
    booking.status = status;
    return this.bookingRepo.save(booking);
  }


  async listPassengers(bookingId: string) {
    return this.passengerRepo.find({ where: { booking: { id: bookingId } } });
  }

  async deletePassenger(bookingId: string, passengerId: string) {
    const res = await this.passengerRepo.delete({ id: passengerId, booking: { id: bookingId } as any });
    if (!res.affected) throw new NotFoundException('Passenger not found on that booking');
    return { deleted: true };
  }

  async checkin(bookingId: string) {
    const booking = await this.getBooking(bookingId);
    if (booking.status !== 'paid') throw new BadRequestException('Booking must be paid to check in');
    booking.status = 'checked-in';
    return this.bookingRepo.save(booking);
  }

  //Ticket emailing
  async sendticketEmail(customerEmail: string, booking: Booking) {
    const flight = booking.flight;

    await this.mailerService.sendMail({
      to: customerEmail,
      subject: `Your Flight Ticket Confirmation - Booking ID: ${booking.id}`,
      html: `
      <h2>Your Flight Ticket is Confirmed!</h2>
      <p>Dear Customer,</p>
      <p>Your booking has been successfully confirmed. Here are your ticket details:</p>

      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.id}</li>
        <li><strong>Flight Number:</strong> ${flight.flightNumber}</li>
      </ul>

      <p>We wish you a pleasant flight!</p>
      `,
    });
  }

}