import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    // eslint-disable-next-line prettier/prettier
  UsersModule,
    // eslint-disable-next-line prettier/prettier
   MongooseModule.forRoot('mongodb+srv://vaneimendes:ostenmoove@cluster0.qx4p4jp.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
