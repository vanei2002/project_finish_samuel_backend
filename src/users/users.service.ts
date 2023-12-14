import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';

import { generateRandomToken } from 'utils/token';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import * as handlebars from 'handlebars';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as fs from 'fs';

interface Login extends CreateUserDto {
  _id: ObjectId;
  __v: number;
}

export interface ResetPassword extends CreateUserDto {
  _id: ObjectId;
  _doc?: object | any;
  token: string;
}

export interface NewPassword {
  password: {
    password: string;
    confirmPassword: string;
  };
  email: string;
}

const secretKey = 'ertyubino';
let tokenTemp;
let tokenTempCreate;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async sendEmail(user: any, code: string) {
    console.log(user, code);
    try {
      const filePath = path.join(
        process.cwd(),
        'src/template/reset_user.html.hbs',
      );

      const templateContent = fs.readFileSync(filePath, 'utf-8').toString();

      const compiledTemplate = handlebars.compile(templateContent);

      const emailContent = compiledTemplate({ code: 'teste', absoluteUrl: '' });

      await this.rabbitmq.emit({
        pattern: 'send-notification',
        data: {
          sender: {
            name: 'Verse Cert',
            email: 'mario.santos@ostenmoove.com.br',
          },
          notification: {
            type: 'EMAIL',
            content: emailContent,
            subject: 'ds',
          },

          recipients: [
            {
              userId: 'user._id',
              name: 'user.name',
              email: 'vanei.mendes@ostenmoove.com.br',
            },
          ],
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const validateUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    try {
      if (validateUser) {
        return {
          message: 'User already exists',
          status: 409,
        };
      }

      const saltOrRounds = 10;
      const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

      const user = new this.userModel({ ...createUserDto, password });
      tokenTempCreate = generateRandomToken(6);

      setTimeout(
        () => {
          tokenTempCreate = null;
        },
        1000 * 60 * 3,
      );

      this.sendEmail(user, tokenTempCreate);

      user.save();

      return {
        data: { user, tokenTempCreate },
        message: 'User created successfully',
        status: 201,
      };
    } catch (err) {
      return {
        message: 'Error creating user',
        status: 400,
      };
    }
  }

  async login({ email, password }: CreateUserDto) {
    const validateData: Login | any = await this.userModel.findOne({ email });

    try {
      if (!validateData) {
        return {
          menssage: 'user not found',
          status: 401,
        };
      }

      const validatePassword = await bcrypt.compareSync(
        password,
        validateData.password,
      );

      if (!validatePassword) {
        return {
          menssage: 'incorrect password',
          status: 401,
        };
      }

      const token = jwt.sign({ validateData }, secretKey, {
        expiresIn: '24h',
      });

      return {
        data: { validateData, token },
        status: 201,
      };
    } catch (err) {
      return {
        message: 'erro systen',
        status: 404,
      };
    }
  }

  async CodeRegister(e: CreateUserDto) {
    const user: ResetPassword = await this.userModel.findOne({
      email: e.email,
    });

    try {
      if (!user) {
        return {
          message: 'user not found',
          status: 404,
        };
      }

      tokenTemp = generateRandomToken(6);

      setTimeout(
        () => {
          tokenTemp = null;
        },
        1000 * 60 * 3,
      );

      const data: ResetPassword = {
        ...user._doc,
        token: tokenTemp,
      };

      return {
        data,
        message: 'token created successfully',
        status: 201,
      };
    } catch (err) {
      return {
        message: 'erro systen',
        status: 404,
      };
    }
  }

  async resetPassword(e: CreateUserDto) {
    const user: ResetPassword = await this.userModel.findOne({
      email: e.email,
    });

    try {
      if (!user) {
        return {
          message: 'user not found',
          status: 404,
        };
      }

      tokenTemp = generateRandomToken(6);

      this.sendEmail(user, tokenTemp);

      setTimeout(
        () => {
          tokenTemp = null;
        },
        1000 * 60 * 3,
      );

      const data: ResetPassword = {
        ...user._doc,
      };

      return {
        data,
        message: 'token created successfully',
        status: 201,
      };
    } catch (err) {
      return {
        message: 'erro systen',
        status: 404,
      };
    }
  }

  async validateCode(createUserDto: CreateUserDto) {
    const { token, text } = createUserDto;
    const validaterouter = text === 'reset' ? tokenTemp : tokenTempCreate;
    console.log(createUserDto);

    console.log(validaterouter);

    if (token !== validaterouter) {
      return {
        data: false,
        message: 'incorrect code',
        status: 401,
      };
    }

    return {
      data: true,
      message: 'code validated successfully',
      status: 200,
    };
  }

  async updatePassword({ email, password }: NewPassword) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return {
        message: 'user not found',
        status: 404,
      };
    }

    await this.userModel.updateOne({ password: password.password });

    return {
      message: 'password updated successfully',
      status: 200,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
