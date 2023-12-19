import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    UsersModule,
    // eslint-disable-next-line prettier/prettier
    MongooseModule.forRoot('mongodb+srv://samuel_matheus:samuel_matheus@cluster2.u6ndnyy.mongodb.net/')
    // MongooseModule.forRoot(`${process.env.CONNECT_DB}`),
  ],
})
export class AppModule {}
