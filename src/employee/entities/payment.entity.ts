import { Entity, PrimaryGeneratedColumn, Column, OneToOne,  } from "typeorm";
import { Booking } from "../../shared/entities/booking.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Booking, booking => booking.payment)
    booking: Booking;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column()
    method: string;
}