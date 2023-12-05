import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    UsersModule,
    // eslint-disable-next-line prettier/prettier
    MongooseModule.forRoot('mongodb+srv://vaneimendes:ostenmoove@cluster0.qx4p4jp.mongodb.net/versecert-api')
  ],
})
export class AppModule {}
