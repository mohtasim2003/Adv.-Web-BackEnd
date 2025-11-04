import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
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
  createAdmin(@Body() mydata:AdminDTO) : object
  {
    console.log(mydata.name);
    return this.adminService.createAdmin(mydata);
  }

  @Delete('deleteadmin')
  deleteAdmin(@Query('id') id:number, @Query('name') name:string): object {
    return this.adminService.deleteAdmin(id , name);
  }

  @Put('updateadmin/:id')
  updateAdmin(@Param('id') id:number, @Body() mydata:AdminDTO): object {
    return this.adminService.updateAdmin(id, mydata);
  }

  @Patch('updatepassword/:id')
  updatePassword(@Param('id') id:number, @Body('password') password:string): object {
    return this.adminService.updateAdminPassword(id, password); ;
  }

  @Get('getalladmin')
  getAllAdmin(): object {
    return this.adminService.getAllAdmin();
  }

  @Get('getbyidandname')
  getByIdAndName(@Query('id') id:number, @Query('name') name:string): object{
    return this.adminService.getByIdAndName(id, name);
  }

  @Get('getbyname/:name')
  getByName(@Param('name') name:string): object{
    return this.adminService.getByName(name);
  }

}
