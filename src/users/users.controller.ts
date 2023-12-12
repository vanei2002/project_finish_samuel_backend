import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewPassword, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.create(createUserDto);
    return data;
  }

  @Post('/sing')
  singUser(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.login(createUserDto);
    return data;
  }

  @Post('/reset_password')
  resetPassword(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.resetPassword(createUserDto);
    return data;
  }

  @Post('/register')
  CodeRegister(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.CodeRegister(createUserDto);
    return data;
  }

  @Post('/validate_code')
  validateCode(@Body() createUserDto: CreateUserDto) {
    const data = this.usersService.validateCode(createUserDto);
    return data;
  }

  @Get()
  findAll() {}

  @Patch('/update_password')
  update(@Body() updateUserDto: NewPassword) {
    return this.usersService.updatePassword(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
