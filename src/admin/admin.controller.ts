import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError,diskStorage } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('getbyid/:id')
  getById(@Param('id') id:number): object{
    return this.adminService.getAdminById(id);
  }

  @Post('createadmin')
  @UsePipes(new ValidationPipe())
  createAdmin(@Body() mydata:AdminDTO) : object
  {
    console.log(mydata.name);
    return this.adminService.createAdmin(mydata);
  }

  @Post('fileupload/:id')
  @UseInterceptors(FileInterceptor('myfile',
    {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.pdf$/)) {
          cb(null, true);
        }
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    })
    }))
    uploadFile(@Param('id') id:number , @UploadedFile() file: Express.Multer.File): object {
      let filename = file.filename;
      return this.adminService.uploadFile(id, filename);
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
