import { Injectable } from '@nestjs/common';
import { CreateCheckinDto } from './dto/checkin.dto';

type Checkin = CreateCheckinDto & { id: string };

@Injectable()
export class StaffCheckinService {
  private checkins: Checkin[] = [];

  createCheckin(data: CreateCheckinDto) {
    const newCheckin: Checkin = { id: Date.now().toString(), ...data };
    this.checkins.push(newCheckin);
    return { message: 'Check-in created successfully', data: newCheckin };
  }

  getPassengerById(id: string) {
    const passenger = this.checkins.find(c => c.id === id);
    return passenger || { message: 'Passenger not found' };
  }

  getPassengersByFlight(flightNo: string) {
    const passengers = this.checkins.filter(c => c.flightNumber === flightNo);
    return { flightNo, total: passengers.length, passengers };
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
      (!name || c.passengerName.includes(name)) &&
      (!ticket || c.ticketNumber === ticket)
    );
    return { count: results.length, results };
  }

  getSummary() {
    const total = this.checkins.length;
    const checkedIn = this.checkins.filter(c => c.status === 'checked-in').length;
    return { total, checkedIn, pending: total - checkedIn };
  }
}