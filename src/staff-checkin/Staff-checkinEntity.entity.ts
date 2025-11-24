import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity('staff_checkin')
export class StaffCheckinEntity {

  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ length: 150, unique: true })
  uniqueId: string; 

  @CreateDateColumn()
  joiningDate: Date; 

  @Column({ length: 30, default: 'Unknown' })
  country: string;
  
  @BeforeInsert()
  generateUniqueId() {
    if (!this.uniqueId) {
      this.uniqueId = uuidv4();
    }
  }
}