import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from '../shared/entities/booking.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Passenger } from '../shared/entities/passenger.entity';
import { Payment } from './entities/payment.entity';
import { Flight } from '../shared/entities/flight.entity';
import { User } from '../shared/entities/user.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Passenger) private passengerRepo: Repository<Passenger>,
    private dataSource: DataSource,
    @InjectRepository(Flight) private flightRepo: Repository<Flight>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}


  //old
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
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }});
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
      return saved;
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
}