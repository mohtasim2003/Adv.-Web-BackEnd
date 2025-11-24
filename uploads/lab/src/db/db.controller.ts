import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body
} from '@nestjs/common';
import { DbService } from './db.service';
import { Users } from './db.entity';


@Controller('db')
export class DbController {
    constructor(private readonly dbService: DbService) { }

    @Post('createuser')
    async createUser(@Body() userData: Users): Promise<Users> {
        return this.dbService.createUser(userData);
    }

    @Post('checkpassword/:username')
    async checkPassword(@Param('username') username: string, @Body('password') password: string): Promise<object> {
        return this.dbService.checkPassword(username, password);
    }


    @Get('fullname/:substring')
    async getUsersByFullNameSubstring(@Param('substring') substring: string): Promise<Users[]> {
        return this.dbService.findUsersByFullNameSubstring(substring);
    }

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string): Promise<object> {
        return this.dbService.findUserByUsername(username);
    }

    @Delete('username/:username')
    async deleteUserByUsername(@Param('username') username: string) : Promise<object> {
        return this.dbService.deleteUserByUsername(username);
    }


}
