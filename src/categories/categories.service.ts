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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);

    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    await this.checkCategoryExistsById(id);

    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.checkCategoryExistsById(id);

    return this.categoryModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateCategoryDto,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.checkCategoryExistsById(id);

    this.categoryModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }

  private async checkCategoryExistsById(id: string): Promise<void> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
