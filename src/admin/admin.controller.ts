import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('getbyid/:id')
  getById(@Param('id') id:number): object{
    return this.adminService.getAdminById(id);
  }
  @Post('createadmin')
  createAdmin(@Body() mydata:AdminDTO)
  {
    console.log(mydata.name);
    return this.adminService.createAdmin(mydata);
  }
}
