// staff-checkin.service.ts

import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/checkin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StaffCheckinEntity } from './Staff-checkinEntity.entity';
import { startOfDay, endOfDay } from 'date-fns'; // This is correct and safe

type Checkin = CreateCheckinDto & { id: string };

@Injectable()
export class StaffCheckinService {
  // In-memory array (old system - kept for backward compatibility)
  private checkins: Checkin[] = [];

  constructor(
    @InjectRepository(StaffCheckinEntity)
    private userRepo: Repository<StaffCheckinEntity>,
  ) {}

  // ---------- OLD NON-ORM METHODS (you can keep or remove later) ----------
  getPassengerById(id: string) {
    const passenger = this.checkins.find(c => c.id === id);
    return passenger || { message: 'Passenger not found' };
  }

  getPassengersByFlight(flightNo: string) {
    const passengers = this.checkins.filter(c => c.flightNumber === flightNo);
    return { flightNo, totalpassengers: passengers.length, passengers };
  }

  updateSeat(id: string, seatNumber: string) {
    const checkin = this.checkins.find(c => c.id === id);
    if (checkin) checkin.seatNumber = seatNumber;
    return { message: 'Seat updated', checkin };
  }

  updateStatus(id: string, status: string) {
    const checkin = this.checkins.find(c => c.id === id);
    if (checkin) checkin.status = status;
    return { message: 'Status updated', checkin };
  }

  deleteCheckin(id: string) {
    this.checkins = this.checkins.filter(c => c.id !== id);
    return { message: 'Check-in deleted successfully' };
  }

  searchPassengers(name?: string, ticket?: string) {
    const results = this.checkins.filter(c =>
      (!name || c.passengerName?.includes(name)) &&
      (!ticket || c.ticketNumber === ticket)
    );
    return { count: results.length, results };
  }

  getSummary() {
    const total = this.checkins.length;
    const checkedIn = this.checkins.filter(c => c.status === 'checked-in').length;
    return { totalpassengers: total, checkedIn, pending: total - checkedIn };
  }

  createCheckin(data: CreateCheckinDto) {
    const newCheckin: Checkin = { id: Date.now().toString(), ...data };
    this.checkins.push(newCheckin);
    return { message: 'Check-in created successfully', data: newCheckin };
  }

  // ---------- ORM METHODS (Now Fully Working) ----------

  // CREATE STAFF CHECK-IN
  async createUser(data: Partial<StaffCheckinEntity>) {
    const user = this.userRepo.create({
      country: data.country || 'Unknown',
    });
    const savedUser = await this.userRepo.save(user);
    return {
      message: 'Staff check-in created successfully',
      data: savedUser,
    };
  }

  // UPDATE COUNTRY BY uniqueId
  async updateCountry(uniqueId: string, country: string) {
    const user = await this.userRepo.findOneBy({ uniqueId });
    if (!user) return { message: 'User not found' };

    user.country = country;
    await this.userRepo.save(user);
    return {
      message: 'Country updated successfully',
      data: user,
    };
  }

  // FIXED & WORKING: Get users by joining date (YYYY-MM-DD)
  async getByJoiningDate(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Correct local date

    if (isNaN(date.getTime())) {
      return {
        message: 'Invalid date format. Use YYYY-MM-DD',
        count: 0,
        data: [],
      };
    }

    const start = startOfDay(date);
    const end = endOfDay(date);

    const users = await this.userRepo.find({
      where: {
        joiningDate: Between(start, end),
      },
      order: { joiningDate: 'ASC' },
    });

    return {
      date: dateString,
      count: users.length,
      message: users.length ? `Found ${users.length} record(s)` : 'No records found',
      data: users,
    };
  }

  // GET USERS WITH COUNTRY = 'Unknown'
  async getUnknownCountry() {
    const users = await this.userRepo.find({
      where: { country: 'Unknown' },
      order: { joiningDate: 'DESC' },
    });
    return { count: users.length, data: users };
  }
}