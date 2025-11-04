import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [AdminModule,UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
