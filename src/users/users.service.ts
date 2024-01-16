import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './users.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { validate } from 'class-validator';
import { encodePassword } from 'src/util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(
    emailOrPhone: string,
    role: UserRole,
  ): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: [
        { email: emailOrPhone, role: role },
        { phone: emailOrPhone, role: role },
      ],
    });
  }

  async create(userDto: RegisterUserDto): Promise<string> {
    const { phone, role, password, name, email, storeRole } = userDto;

    const newUser = new User();
    newUser.phone = phone;
    newUser.role = role;
    newUser.name = name;
    newUser.email = email;
    newUser.storeRole = storeRole;
    newUser.encryptedPassword = encodePassword(password);

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: errors,
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const savedUser = await this.usersRepository.save(newUser);
      return savedUser.uuid;
    } catch (error) {
      throw new HttpException(
        {
          message: ['User already exists'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
