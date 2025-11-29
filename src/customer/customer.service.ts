import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Booking } from '../shared/entities/booking.entity';
import { Flight } from '../shared/entities/flight.entity';
// import { Passenger } from './entities/passenger.entity';
import { Payment } from '../shared/entities/payment.entity';
import { User } from '../shared/entities/user.entity';
import { Profile } from './entities/profile.entity';

import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Passenger } from 'src/shared/entities/passenger.entity';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    @InjectRepository(Flight)
    private flightRepo: Repository<Flight>,

    @InjectRepository(Passenger)
    private passengerRepo: Repository<Passenger>,

    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}



  // ── REGISTER + BCRYPT (3 marks) ─────────────────────
  async registerCustomer(dto: RegisterCustomerDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      UserRole: 'customer',
    });
    user.profile = this.profileRepo.create({ name: dto.name });
    await this.userRepo.save(user);
    return { message: 'Registered successfully' };
  }

  // ── LOGIN + JWT (part of 5 marks) ───────────────────
  async loginCustomer(dto: LoginCustomerDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ['profile'],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: jwt.sign(payload, process.env.JWT_SECRET || 'secret123', { expiresIn: '24h' }),
      user: { id: user.id, email: user.email, name: user.profile?.name },
    };
  }

  // ------------------------------------------------------------------------
  // CREATE BOOKING
  // ------------------------------------------------------------------------
  async createBooking(userId: string, dto: CreateBookingDto) {
    const flight = await this.flightRepo.findOne({
      where: { id: dto.flightId },
    });

    if (!flight) throw new NotFoundException('Flight not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const passengers = dto.passengers.map((p) =>
      this.passengerRepo.create(p),
    );

    const booking = this.bookingRepo.create({
      flight,
      customer: user,
      status: 'confirmed',
      passengers,
      bookingDate: new Date(),
    });

    // Payment (optional)
    if (dto.paymentMethod) {
      const payment = this.paymentRepo.create({
        amount: 100, // later you can calculate real fare
        method: dto.paymentMethod,
      });
      booking.payment = payment;
    }

    return this.bookingRepo.save(booking);
  }

  // ------------------------------------------------------------------------
  // GET ALL CUSTOMER BOOKINGS
  // ------------------------------------------------------------------------
  async getMyBookings(userId: string) {
    return this.bookingRepo.find({
      where: { customer: { id: userId } },
      relations: ['flight', 'passengers', 'payment'],
    });
  }

  // ------------------------------------------------------------------------
  // GET SINGLE BOOKING DETAILS
  // ------------------------------------------------------------------------
  async getBooking(userId: string, bookingId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['flight', 'passengers', 'payment', 'customer'],
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.customer.id !== userId)
      throw new ForbiddenException('Not allowed');

    return booking;
  }

  // ------------------------------------------------------------------------
  // GET PROFILE
  // ------------------------------------------------------------------------
  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User not found');

    return user.profile;
  }

  // ------------------------------------------------------------------------
  // UPDATE PROFILE
  // ------------------------------------------------------------------------
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException('User not found');

    // Create a profile if user does not have one
    if (!user.profile) {
      user.profile = this.profileRepo.create({
        ...dto,
        user,
      });
    } else {
      Object.assign(user.profile, dto);
    }

    await this.userRepo.save(user);
    return user.profile;
  }
}
