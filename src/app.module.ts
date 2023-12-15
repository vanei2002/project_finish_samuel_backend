import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    UsersModule,
    // eslint-disable-next-line prettier/prettier
    MongooseModule.forRoot('Link do banco')
    // MongooseModule.forRoot(`${process.env.CONNECT_DB}`),
  ],
})
export class AppModule {}
