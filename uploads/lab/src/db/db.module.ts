import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './db.entity';
import { JwtModule } from '@nestjs/jwt';
import { DbService } from './db.service';
import { DbController } from './db.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Users])],
  controllers: [DbController],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
