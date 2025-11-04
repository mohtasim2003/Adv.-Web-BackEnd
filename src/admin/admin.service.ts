import { Injectable } from '@nestjs/common';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {
    
  getAdminById(id: number): object { 
    return { id: id, name: 'Admin Name', password: 'password' };
  }

  createAdmin(mydata:AdminDTO): object {
    console.log(mydata);
    return mydata;
  }

  deleteAdmin(id: number , name:string): object {
    return { message: `Admin with id ${id}, name ${name} has been deleted.` };
  }

  updateAdmin(id: number, mydata:AdminDTO): object {
    return { id: id, name: mydata.name, password: mydata.password };
  } 

  updateAdminPassword(id: number, password:string): object {
    return { id: id, message: `Password updated to ${password}` };
  }

  getAllAdmin(): object {
    return [
      { id: 1, name: 'Admin One' },
      { id: 2, name: 'Admin Two' },
    ];
  }

  getByIdAndName(id: number, name:string): object {
    return { id: id, name: name };
  }

  getByName(name:string): object{
    return { id:1 ,name: name };
  }
}
