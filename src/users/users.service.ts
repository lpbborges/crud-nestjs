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

  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);

    return user.save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    await this.checkUserExistsById(id);

    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.checkUserExistsById(id);

    return this.userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateUserDto,
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    await this.checkUserExistsById(id);

    this.userModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }

  private async checkUserExistsById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
