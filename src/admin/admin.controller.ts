import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Put, Query, Res, Session, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminDto } from "./dto/admin.dto";
import { CreateAircraftDto } from "./dto/aircraft.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { JwtGuard } from "./admin.guard";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() body: AdminDto): Promise<object> {
        return this.adminService.login(body.mail, body.password);
    }

    
    
    
    @Post('aircraft')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    async createAircraft(@Body() aircraftData: CreateAircraftDto): Promise<object> {
        return this.adminService.createAircraft(aircraftData);
    }

    @Put('aircraft/:id')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    async updateAircraft(@Param('id', ParseUUIDPipe) id: string, @Body() aircraftData: CreateAircraftDto): Promise<object> {
        return this.adminService.updateAircraft(id, aircraftData);
    }
    

    @Delete('aircraft/:id')
    @UseGuards(JwtGuard)
    async deleteAircraft(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteAircraft(id);
    }

    @Get('getallaircraft')
    @UseGuards(JwtGuard)
    async getAllAircraft(): Promise<object> {
        return this.adminService.getAllAircraft();
    }

    @Get('getactiveaircraft')
    @UseGuards(JwtGuard)
    async getActiveAircraft(): Promise<object> {
        return this.adminService.getActiveAircraft();
    }

    @Patch('aircraft/status/:id')
    @UseGuards(JwtGuard)
    async updateAircraftStatus(@Param('id',ParseUUIDPipe) id: string , @Body('status') status: string): Promise<object> {
        return this.adminService.updateAircraftStatus(id, status);
    }

    @Post('createflight')
    @UseGuards(JwtGuard)
    @UsePipes(new ValidationPipe())
    async createFlight(@Body() flightData: any): Promise<object> {
        return this.adminService.createFlight(flightData);
    }

    @Get('getallflight')
    @UseGuards(JwtGuard)
    async getAllFlight(): Promise<object> {
        return this.adminService.getAllFlight();
    }

    @Patch('flight/status/:id')
    @UseGuards(JwtGuard)
    async updateFlightStatus(@Param('id',ParseUUIDPipe) id: string , @Body('status') status: string): Promise<object> {
        return this.adminService.updateFlightStatus(id, status);
    }

    @Delete('flight/:id')
    @UseGuards(JwtGuard)
    async deleteFlight(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteFlight(id);
    }


    @Post('createemployee')
    @UseGuards(JwtGuard)
    async createEmployee(@Body() employeeData: EmployeeDto): Promise<object> {
        return this.adminService.createEmployee(employeeData);
    }

    @Get('getallemployee')
    @UseGuards(JwtGuard)
    async getAllEmployee(): Promise<object> {
        return this.adminService.getAllEmployee();
    }

    @Patch('employee/status/:id')
    @UseGuards(JwtGuard)
    async updateEmployeeStatus(@Param('id',ParseUUIDPipe) id: string , @Body('isActive') isActive: boolean): Promise<object> {
        return this.adminService.updateEmployeeStatus(id, isActive);
    }

    @Delete('employee/:id')
    @UseGuards(JwtGuard)
    async deleteEmployee(@Param('id', ParseUUIDPipe) id: string): Promise<object> {
        return this.adminService.deleteEmployee(id);
    }

    @Post('flights/:flightId/crew/:employeeId')
    @UseGuards(JwtGuard)
    async assignEmployeeToFlight(
        @Param('flightId', ParseUUIDPipe) flightId: string,
        @Param('employeeId', ParseUUIDPipe) employeeId: string
    ): Promise<object> {
        return this.adminService.assignEmployeeToFlight(flightId, employeeId);
    }

    @Get('flights/:flightId/crew')
    @UseGuards(JwtGuard)
    async getFlightCrew(@Param('flightId', ParseUUIDPipe) flightId: string): Promise<object> {
        return this.adminService.getFlightCrew(flightId);
    }

    @Delete('flights/:flightId/crew/:employeeId')
    @UseGuards(JwtGuard)
    async removeEmployeeFromFlight(
        @Param('flightId', ParseUUIDPipe) flightId: string,
        @Param('employeeId', ParseUUIDPipe) employeeId: string
    ): Promise<object> {
        return this.adminService.removeEmployeeFromFlight(flightId, employeeId);
    }
}