import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    UsersModule,
    RabbitMQModule,
    // eslint-disable-next-line prettier/prettier
    // MongooseModule.forRoot('mongodb+srv://vaneimendes:ostenmoove@cluster0.qx4p4jp.mongodb.net/versecert-api')
    MongooseModule.forRoot(`${process.env.CONNECT_DB}`),
  ],
})
export class AppModule {}
