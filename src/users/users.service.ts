import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface Login extends CreateUserDto {
  _id: ObjectId;
  __v: number;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const validateUser = await this.userModel.findOne({
      cpf: createUserDto.cpf,
    });

    try {
      if (!validateUser) {
        return {
          message: 'User already exists',
          status: 409,
        };
      }

      const saltOrRounds = 10;
      const password = await bcrypt.hash(createUserDto.password, saltOrRounds);

      const user = new this.userModel({ ...createUserDto, password });

      return {
        data: user.save(),
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
      const secretKey = 'ertyubino';

      const token = jwt.sign({ validateData }, secretKey, {
        expiresIn: '1h',
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
