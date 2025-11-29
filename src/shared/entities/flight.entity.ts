import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Aircraft } from './aircraft.entity';
import { User } from './user.entity';

@Entity()
export class Flight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  flightNumber: string;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Column()
  route: string;

  @Column({ default: 'scheduled' })
  status: string;

  @ManyToOne(() => Aircraft, (aircraft) => aircraft.flights)
  aircraft: Aircraft;

  @ManyToMany(() => User)
  @JoinTable()
  crew: User[];
    bookings: any;
}