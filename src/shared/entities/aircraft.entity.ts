import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Flight } from "./flight.entity";

@Entity()
export class Aircraft {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  model: string;

  @Column()
  registration: string;

  @Column({ type: "int" })
  capacity: number;

  @Column({ default: "active" })
  status: string;

  @OneToMany(() => Flight, (flight) => flight.aircraft, { cascade: true })
  flights: Flight[];
}
