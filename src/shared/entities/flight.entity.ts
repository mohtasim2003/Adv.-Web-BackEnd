import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Aircraft } from "./aircraft.entity";
import { User } from "./user.entity";
import { Booking } from "./booking.entity";

@Entity()
export class Flight {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  flightNumber: string;

  @Column({ type: "timestamp" })
  departureTime: Date;

  @Column({ type: "timestamp" })
  arrivalTime: Date;

  @Column()
  route: string;

  @Column({ default: "scheduled" })
  status: string;

  @Column({ type: 'decimal' ,nullable:true})
  price: number;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.flights)
  aircraft: Aircraft;

  @ManyToMany(() => User, (user) => user.flights)
  @JoinTable()
  crew: User[];

  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings: Booking[];
}
