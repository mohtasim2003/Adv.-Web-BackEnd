import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import {Passenger} from "./passenger.entity";
import {Flight} from "./flight.entity";
import {Payment} from "../../employee/entities/payment.entity";
import { User } from "./user.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id: string;

  @ManyToOne(() => Flight, flight => flight.bookings) 
  flight: Flight; 

  @ManyToOne(() => User)  
  customer: User; 

  @Column() 
  bookingDate: Date; 
  @Column({ default: 'pending' }) 
  status: string; 
  
  // inverse side - no JoinColumn here
  @OneToOne(() => Payment, payment => payment.booking, { nullable: true })
  payment?: Payment;

  @OneToMany(() => Passenger, passenger => passenger.booking, { cascade: true })
  passengers: Passenger[]; 
}