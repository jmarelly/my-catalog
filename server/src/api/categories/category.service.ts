import { CategoryModel } from "./category.model";
import { Category } from "./category.schema";

export default class CategoryService {
  constructor(private categoryModel: CategoryModel) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.findAll();
  }
}
