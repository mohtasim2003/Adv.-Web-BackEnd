import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Booking } from '../../shared/entities/booking.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  passport: string;

  @ManyToOne(() => Booking, booking => booking.passengers)
  booking: Booking;
}
