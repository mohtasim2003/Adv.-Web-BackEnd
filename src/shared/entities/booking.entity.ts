import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, CreateDateColumn } from "typeorm";
import {Passenger} from "./passenger.entity";
import {Flight} from "./flight.entity";
import {Payment} from "../../employee/entities/payment.entity";
import { User } from "./user.entity";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Flight, flight => flight.bookings, {eager: true})
    flight: Flight;

    @ManyToOne(() => User, user => user.bookings, {eager: true})
    customer: User;

    @CreateDateColumn()
    bookingDate: Date;

    @Column({default: 'Pending'})
    status: string;

    @OneToOne(() => Payment, payment => payment.booking, {cascade: true, eager: true})
    @JoinColumn()
    payment: Payment;

    @OneToMany(() => Passenger, passenger => passenger.booking, {cascade: true, eager: true})
    passengers: Passenger[];
}