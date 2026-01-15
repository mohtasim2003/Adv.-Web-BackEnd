import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Booking } from "./booking.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;

  @Column("decimal")
  amount: number;

  @Column()
  method: string;
}
