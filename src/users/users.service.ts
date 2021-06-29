import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (user) {
      return user;
    }

    return null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    await this.checkUserExistsById(id);

    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.checkUserExistsById(id);

    if (user.email !== updateUserDto.email) {
      await this.checkEmailExists(updateUserDto.email);
    }

    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.checkUserExistsById(id);

    this.userModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }

  private async checkUserExistsById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async checkEmailExists(email: string): Promise<void> {
    const checkEmailExists = await this.getByEmail(email);

    if (checkEmailExists) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
