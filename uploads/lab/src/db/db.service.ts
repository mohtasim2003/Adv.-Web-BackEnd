import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Users } from './db.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async createUser(userData: Users): Promise<Users> {
    const salt = await bcrypt.genSalt();
    const user = new Users();
    user.username = userData.username;
    user.fullName = userData.fullName;
    user.isActive = userData.isActive;
    user.password = await bcrypt.hash(userData.password, salt);

    return await this.usersRepository.save(user);
  }

  async checkPassword(username: string, plainPassword: string): Promise<object> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      return { message: 'User not found' };
    }
    if(await bcrypt.compare(plainPassword, user.password)){
      
      const payload = { username: user.username};
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    }else{
      return { message: 'Incorrect password' };
    }
  }

  async findUsersByFullNameSubstring(substring: string): Promise<Users[]> {
    let userList = this.usersRepository.find({
      where: {
        fullName: Like(`%${substring}%`),
      },
    });
    return userList;
  }

  async findUserByUsername(username: string): Promise< object > {
    return await this.usersRepository.findOne({
      where: { username },
      select: { username: true, fullName: true },
    });
  }

  async deleteUserByUsername(username: string): Promise<object> {
    const result = await this.usersRepository.delete({ username });

    if (result.affected === 0) {
      return { message: `No user found with username ${username}.` };
    }

    return { message: `User with username ${username} has been deleted.` };
  }
}
