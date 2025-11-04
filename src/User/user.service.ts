import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.Dto';

@Injectable()
export class UserService {
  getAllUsers(role: string) {
    return { message: `GET all users ${role}` };
  }

  getUserById(id: number) {
    return { message: `GET user with ID: ${id}` };
  }

  createUser(userData: CreateUserDto) {
    return { message: 'POST create new user', data: userData };
  }

  updateUser(id: number, userData: UpdateUserDto) {
    return { message: `PUT update user with ID: ${id}`, data: userData };
  }

  patchUser(id: number, updatedData: UpdateUserDto) {
    return { message: `PATCH update user with ID: ${id}`, data: updatedData };
  }

  deleteUser(id: number) {
    return { message: `DELETE user with ID: ${id}` };
  }

  searchUserByName(name: string) {
    return { message: `GET search user by name: ${name}` };
  }

  getUsersByAgeRange(min: number, max: number) {
    return { message: `GET users between ages ${min} and ${max}` };
  }
}
