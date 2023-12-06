import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  latsName: string;

  @Prop()
  cpf: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const userSchema = SchemaFactory.createForClass(User);
