import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  passport: string;

  @ManyToOne(() => Booking, (booking) => booking.passengers, {
    onDelete: 'CASCADE', // Recommended
  })
  booking: Booking;
}