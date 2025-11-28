import { Column, Entity, PrimaryColumn } from "typeorm";



@Entity('admin_login')
export class AdminLogin {

    @PrimaryColumn({ type: 'varchar', length: 100 })
    mail: string;

    @Column({ type: 'varchar', length: 100 })
    password: string;


}