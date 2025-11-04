import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    
  getAdminById(id: number): object { 
    return { id: id, name: 'Admin Name', role: 'Administrator' };
  }

  createAdmin(mydata:object): object {
    console.log(mydata);
    return mydata;
  }
}
