import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsIn,
} from 'class-validator';

export class CreateCheckinDto 
{
  [x: string]: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z\s'-]+$/, 
    {
      message:
      'Passenger Name can contain only letters, spaces, apostrophes or hyphens',
    })
  passengerName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9-]{2,8}$/, 
    {
      message: 'Flight Number must contain letters and numbers (2-8 chars)',
    })
  flightNumber: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{1,2}[A-Z]$/, 
    {
      message: 'Seat Number must be like "12A" or "3C"',
    })
  seatNumber: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^TCK[0-9]+$/, 
    {
      message: 'Ticket Number must start with "TCK" followed by numbers',
    })
  ticketNumber: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsOptional()
  @IsIn(['checked-in', 'checkedin', 'pending', 'cancelled', 'no-show'], 
    {
      message: 'Status must be one of: checked-in, checkedin, pending, cancelled, no-show',
    })
  status?: string;

  }