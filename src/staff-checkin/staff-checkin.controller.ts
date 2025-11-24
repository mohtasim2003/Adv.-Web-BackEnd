import { 
  Controller, Get, Post, Put, Patch, Delete, 
  Param, Query, Body 
} from '@nestjs/common';
import { StaffCheckinService } from './staff-checkin.service';
import { CreateCheckinDto } from './dto/checkin.dto';
import { StaffCheckinEntity } from './Staff-checkinEntity.entity';

@Controller('staff-checkin')
export class StaffCheckinController {

  constructor(private readonly staffCheckinService: StaffCheckinService) {}

  // ---------- OLD NON-ORM ROUTES ----------
  @Post('checkin')
  createCheckin(@Body() dto: CreateCheckinDto) {
    return this.staffCheckinService.createCheckin(dto);
  }

  @Get('passenger/:id')
  getPassengerById(@Param('id') id: string) {
    return this.staffCheckinService.getPassengerById(id);
  }

  @Get('flight/:flightNo')
  getPassengersByFlight(@Param('flightNo') flightNo: string) {
    return this.staffCheckinService.getPassengersByFlight(flightNo);
  }

  @Put('update-seat/:id')
  updateSeat(@Param('id') id: string, @Body('seatNumber') seatNumber: string) {
    return this.staffCheckinService.updateSeat(id, seatNumber);
  }

  @Patch('update-status/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.staffCheckinService.updateStatus(id, status);
  }

  @Delete('delete/:id')
  deleteCheckin(@Param('id') id: string) {
    return this.staffCheckinService.deleteCheckin(id);
  }

  @Get('search')
  searchPassengers(@Query('name') name?: string, @Query('ticket') ticket?: string) {
    return this.staffCheckinService.searchPassengers(name, ticket);
  }

  @Get('summary')
  getSummary() {
    return this.staffCheckinService.getSummary();
  }

  // ---------- ORM ROUTES ----------

  // CREATE USER
  /*@Post('create')
  createORM(@Body() createCheckinDto: CreateCheckinDto) {
  return this.staffCheckinService.staffCheckin(createCheckinDto);
}*/

@Post('create')
async createORM(@Body() data: Partial<StaffCheckinEntity>) {
  return this.staffCheckinService.createUser(data);
}

  // UPDATE COUNTRY
  @Patch(':uniqueId/country')
  updateCountry(
    @Param('uniqueId') uniqueId: string, 
    @Body('country') country: string
  ) {
    return this.staffCheckinService.updateCountry(uniqueId, country);
  }

  // GET USERS BY JOIN DATE
  @Get('joining/:date')
getByJoiningDate(@Param('date') date: string) {
  return this.staffCheckinService.getByJoiningDate(date);
}

  // GET USERS WHERE country = 'Unknown'
  @Get('country/default')
  getUnknownCountry() {
    return this.staffCheckinService.getUnknownCountry();
  }
}