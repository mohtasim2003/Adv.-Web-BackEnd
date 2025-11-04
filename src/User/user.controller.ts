import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.Dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(@Query('role') role: string) {
    return this.userService.getAllUsers(role);
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
    return this.userService.updateUser(id, userData);
  }

  @Patch(':id')
  patchUser(@Param('id') id: number, @Body() updatedData: UpdateUserDto) {
    return this.userService.patchUser(id, updatedData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('search/name')
  searchUserByName(@Query('name') name: string) {
    return this.userService.searchUserByName(name);
  }

  @Get('filter/age')
  getUsersByAgeRange(@Query('min') min: number, @Query('max') max: number) {
    return this.userService.getUsersByAgeRange(min, max);
  }
}
