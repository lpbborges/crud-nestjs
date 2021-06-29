import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = new this.categoryModel(createCategoryDto);

    return category.save();
  }

  findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    await this.checkCategoryExistsById(id);

    return this.categoryModel.findById(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.checkCategoryExistsById(id);

    return this.categoryModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateCategoryDto,
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    await this.checkCategoryExistsById(id);

    this.categoryModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }

  private async checkCategoryExistsById(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
