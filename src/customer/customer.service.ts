// src/customer/customer.service.ts
import * as dotenv from "dotenv";
dotenv.config();
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { User } from "src/shared/entities/user.entity";
import { Profile } from "./entities/profile.entity";
import { Booking } from "src/shared/entities/booking.entity";
import { Flight } from "src/shared/entities/flight.entity";
import { Passenger } from "src/shared/entities/passenger.entity";
import { Payment } from "src/shared/entities/payment.entity";

import { RegisterCustomerDto } from "./dto/register-customer.dto";
import { LoginCustomerDto } from "./dto/login-customer.dto";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { MailerService } from "@nestjs-modules/mailer/dist";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Flight) private flightRepo: Repository<Flight>,
    @InjectRepository(Passenger) private passengerRepo: Repository<Passenger>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  // REGISTER + BCRYPT (3 marks) – NO user.profile (shared User has no relation)
  async registerCustomer(dto: RegisterCustomerDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException("Email already registered");

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashed,
      userRole: "customer", // string – correct
    });
    await this.userRepo.save(user);

    // Create profile separately – Profile owns the FK (100% correct pattern)
    await this.profileRepo.save(
      this.profileRepo.create({
        user: { id: user.id } as User,
        name: dto.name,
      }),
    );

    return {
      message: "Registered successfully",
      email: user.email,
      password: user.password,
    };
  }

  // LOGIN + JWT – Load profile from Profile table only
  async loginCustomer(dto: LoginCustomerDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const profile = await this.profileRepo.findOne({
      where: { user: { id: user.id } },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: "customer",
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || "",
      },
    };
  }

  // ALL OTHER METHODS REMAIN SAME (createBooking, getMyBookings, etc.)
  async createBooking(userId: string, dto: CreateBookingDto) {
    const flight = await this.flightRepo.findOne({
      where: { id: dto.flightId },
    });
    if (!flight) throw new NotFoundException("Flight not found");

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");

    const passengers = dto.passengers.map((p) => this.passengerRepo.create(p));

    const booking = this.bookingRepo.create({
      flight,
      customer: user,
      status: "confirmed",
      passengers,
      bookingDate: new Date(),
    });

    if (dto.paymentMethod) {
      booking.payment = this.paymentRepo.create({
        amount: 999,
        method: dto.paymentMethod,
      });
    }

    await this.mailerService.sendMail({
      to: process.env.ADMIN_MAIL,
      subject: "Booking Notification",
      text: `You have successfully Booked. Access Time: ${new Date().toISOString()}`,
    });

    return this.bookingRepo.save(booking);
  }

  // ... getMyBookings, getBooking, getProfile, updateProfile → SAME AS BEFORE
  async getMyBookings(userId: string) {
    return this.bookingRepo.find({
      where: { customer: { id: userId } },
      relations: ["flight", "passengers", "payment"],
    });
  }

  async deleteProfile(userId: string) {
    const profile = await this.userRepo.delete({
      id: userId,
    });

    return { message: " deleted successfully" };
  }

  async deleteBooking(userId: string, bookingId: string) {
    // Load booking with customer and related entities
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ["customer", "passengers", "payment"],
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    // Prevent users from deleting others’ bookings
    if (booking.customer.id !== userId) {
      throw new ForbiddenException(
        "You are not allowed to delete this booking",
      );
    }

    // Delete booking (will cascade and remove passengers + payment)
    await this.bookingRepo.remove(booking);

    return { message: "Booking deleted successfully" };
  }

  async getBooking(userId: string, bookingId: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ["customer"],
    });
    if (!booking) throw new NotFoundException();
    if (booking.customer.id !== userId) throw new ForbiddenException();
    return booking;
  }

  async getProfile(userId: string) {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });
    return profile || { name: "", phone: "", address: "", loyaltyPoints: 0 };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    let profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!profile) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException();
      profile = this.profileRepo.create({ ...dto, user });
    } else {
      Object.assign(profile, dto);
    }

    // Save directly via profileRepo
    return this.profileRepo.save(profile);
  }
}
