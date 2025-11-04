import { 
  Controller, Get, Post, Put, Patch, Delete, 
  Param, Query, Body 
} from '@nestjs/common';
import { StaffCheckinService } from './staff-checkin.service';
import { CreateCheckinDto } from './dto/checkin.dto';

@Controller('staff-checkin')
export class StaffCheckinController {
  constructor(private readonly staffCheckinService: StaffCheckinService) {}

  @Post('checkin')
  createCheckin(@Body() createCheckinDto: CreateCheckinDto) {
    return this.staffCheckinService.createCheckin(createCheckinDto);
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
}