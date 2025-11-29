import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, Query, Res, Session, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLogin } from "./dto/admin.entity";
import { AdminDto } from "./dto/admin.dto";
import { CreateAircraftDto } from "./dto/aircraft.dto";
import { EmployeeDto } from "./dto/employee.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() body: AdminDto): Promise<object> {
        console.log(body);
        return this.adminService.login(body.mail, body.password);
    }

    @Post('createadmin')
    async createAdmin(@Body() adminData: AdminLogin): Promise<object> {
        return this.adminService.createAdmin(adminData);
    }
    
    
    @Post('aircraft')
    @UsePipes(new ValidationPipe())
    async createAircraft(@Body() aircraftData: CreateAircraftDto): Promise<object> {
        return this.adminService.createAircraft(aircraftData);
    }

    @Put('aircraft/:id')
    @UsePipes(new ValidationPipe())
    async updateAircraft(@Param('id', ParseUUIDPipe) id: string, @Body() aircraftData: CreateAircraftDto): Promise<object> {
        return this.adminService.updateAircraft(id, aircraftData);
    }
    

    @Delete('aircraft/:id')
    async deleteAircraft(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteAircraft(id);
    }

    @Get('getallaircraft')
    async getAllAircraft(): Promise<object> {
        return this.adminService.getAllAircraft();
    }

    @Get('getactiveaircraft')
    async getActiveAircraft(): Promise<object> {
        return this.adminService.getActiveAircraft();
    }

    @Patch('aircraft/status/:id')
    async updateAircraftStatus(@Param('id',ParseUUIDPipe) id: string , @Body('status') status: string): Promise<object> {
        return this.adminService.updateAircraftStatus(id, status);
    }

    @Post('createflight')
    @UsePipes(new ValidationPipe())
    async createFlight(@Body() flightData: any): Promise<object> {
        return this.adminService.createFlight(flightData);
    }

    @Get('getallflight')
    async getAllFlight(): Promise<object> {
        return this.adminService.getAllFlight();
    }

    @Patch('flight/status/:id')
    async updateFlightStatus(@Param('id',ParseUUIDPipe) id: string , @Body('status') status: string): Promise<object> {
        return this.adminService.updateFlightStatus(id, status);
    }

    @Delete('flight/:id')
    async deleteFlight(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteFlight(id);
    }


    @Post('createemployee')
    async createEmployee(@Body() employeeData: EmployeeDto): Promise<object> {
        return this.adminService.createEmployee(employeeData);
    }

    @Get('getallemployee')
    async getAllEmployee(): Promise<object> {
        return this.adminService.getAllEmployee();
    }

    @Patch('employee/status/:id')
    async updateEmployeeStatus(@Param('id',ParseUUIDPipe) id: string , @Body('isActive') isActive: boolean): Promise<object> {
        return this.adminService.updateEmployeeStatus(id, isActive);
    }

    @Delete('employee/:id')
    async deleteEmployee(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteEmployee(id);
    }

    @Post('flights/:flightId/crew/:employeeId')
    async assignEmployeeToFlight(
        @Param('flightId', ParseUUIDPipe) flightId: string,
        @Param('employeeId', ParseUUIDPipe) employeeId: string
    ): Promise<object> {
        return this.adminService.assignEmployeeToFlight(flightId, employeeId);
    }

    @Get('flights/:flightId/crew')
    async getFlightCrew(@Param('flightId', ParseUUIDPipe) flightId: string): Promise<object> {
        return this.adminService.getFlightCrew(flightId);
    }

    @Delete('flights/:flightId/crew/:employeeId')
    async removeEmployeeFromFlight(
        @Param('flightId', ParseUUIDPipe) flightId: string,
        @Param('employeeId', ParseUUIDPipe) employeeId: string
    ): Promise<object> {
        return this.adminService.removeEmployeeFromFlight(flightId, employeeId);
    }
}