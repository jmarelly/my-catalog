import { Request, Response } from 'express';
import CategoryService from './category.service';

export default class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = async (req: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();
    return res.status(200).json(categories);
  };
}
