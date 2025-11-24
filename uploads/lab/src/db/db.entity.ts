import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, PrimaryColumn} from 'typeorm';



@Entity('test')
export class Users {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 150 })
    fullName: string;
    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @Column({type: 'varchar', length: 100 })
    password: string;

    @BeforeInsert()
    generateId() {
        this.id = Math.floor(Math.random() * 1000000);
    } 
}
