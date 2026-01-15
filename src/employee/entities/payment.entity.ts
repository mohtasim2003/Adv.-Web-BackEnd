import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Booking } from "../../shared/entities/booking.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("decimal")
  amount: number;

  @Column()
  method: string;

  // Make Payment the owning side and add JoinColumn
  @OneToOne(() => Booking, (booking) => booking.payment)
  @JoinColumn()
  booking: Booking;
}
