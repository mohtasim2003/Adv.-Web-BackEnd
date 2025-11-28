import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Res, Session, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLogin } from "./dto/admin.entity";
import { AdminDto } from "./dto/admin.dto";
import { CreateAircraftDto } from "./dto/aircraft.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() body: AdminDto): Promise<object> {
        console.log(body);
        return this.adminService.login(body.mail, body.password);
    }

    /*@Post('createadmin')
    async createAdmin(@Body() adminData: AdminLogin): Promise<AdminLogin> {
        return this.adminService.createAdmin(adminData);
    }*/
    
    
    @Post('aircraft')
    @UsePipes(new ValidationPipe())
    async createAircraft(@Body() aircraftData: CreateAircraftDto): Promise<object> {
        return this.adminService.createAircraft(aircraftData);
    }
    

    
    
    
}


