import { Category } from 'src/categories/entities/category.entity';

export class CreateProductDto {
  description: string;
  price: number;
  category: Category;
}
