import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Flight } from './flight.entity';
import { User } from './user.entity';
// import { Payment } from './payment.entity';
// import { Passenger } from '../../customer/entities/passenger.entity';
import { Payment } from './payment.entity';
import { Passenger } from 'src/customer/entities/passenger.entity';
// import { Passenger } from './passenger.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Flight, flight => flight.bookings)
  flight: Flight;

  @ManyToOne(() => User, user => user.bookings) // customer
  customer: User;

  @CreateDateColumn()
  bookingDate: Date;

  @Column({ default: 'pending' })
  status: string;

  @OneToOne(() => Payment, payment => payment.booking, { cascade: true })
  payment: Payment;

  @OneToMany(() => Passenger, passenger => passenger.booking, { cascade: true })
  passengers: Passenger[];
}
