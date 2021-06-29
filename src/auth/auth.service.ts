import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 10);

    await this.usersService.checkEmailExists(createUserDto.email);

    const createdUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    createdUser.password = undefined;

    return createdUser;
  }

  async validateUser(email: string, pass: string): Promise<UserDocument> {
    try {
      const user = await this.usersService.getByEmail(email);

      await this.verifyPassword(pass, user.password);

      return user;
    } catch {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signIn(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
