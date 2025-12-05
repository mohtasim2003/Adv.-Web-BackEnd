import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import {Passenger} from "./passenger.entity";
import {Flight} from "./flight.entity";
import {Payment} from "../../employee/entities/payment.entity";
import { User } from "./user.entity";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Flight, (flight) => flight.bookings)
  flight: Flight;

  @ManyToOne(() => User)
  customer: User;

<<<<<<< HEAD
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
=======
  @Column()
  bookingDate: Date;
  @Column({ default: 'pending' })
  status: string;

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true })
  @JoinColumn()
  payment: Payment;

  @OneToMany(() => Passenger, (passenger) => passenger.booking, {
    cascade: true,
  })
  passengers: Passenger[];
}
>>>>>>> 03b714da24637d82f077ba0aa5f4cd1bab0147e2
