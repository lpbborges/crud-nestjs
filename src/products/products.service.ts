import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoriesService } from 'src/categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);

    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    await this.checkProductExistsById(id);

    return this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.checkProductExistsById(id);

    return this.productModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $set: updateProductDto,
        },
        {
          new: true,
        },
      )
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.checkProductExistsById(id);

    this.productModel
      .deleteOne({
        _id: id,
      })
      .exec();
  }

  private async checkProductExistsById(id: string): Promise<void> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
