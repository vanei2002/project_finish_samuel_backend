export class CreateUserDto {
  name: string;
  cpf: string;
  lastName: string;
  email: string;
  password: string;
  token?: string;
  text?: string;
}
