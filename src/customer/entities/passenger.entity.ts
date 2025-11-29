import { Booking } from 'src/shared/entities/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


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
