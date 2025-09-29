export class CreateUserDto {
  email: string;
  name?: string;
  password_hash: string;
  role_id: number;
}
