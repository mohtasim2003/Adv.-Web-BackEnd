import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Booking, booking => booking.payment)
  @JoinColumn() // Payment owns FK to Booking
  booking: Booking;

  @Column('decimal')
  amount: number;

  @Column()
  method: string; 
}
