import { Injectable } from '@nestjs/common';
import { AdminDTO } from './admin.dto';

@Injectable()
export class AdminService {

  uploadFile(id: number, filename: string): object {
    return { message: `File ${filename} uploaded for Admin with id ${id}` };
  }
    
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
    return { message: `Admin updated. Id ${id}` };
  } 

  updateAdminName(id: number, name:string): object {
    return { id: id, message: `Name updated to ${name}` };
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
