// DI Container
import { ProductModel } from "../api/products/product.model";
import { CategoryModel } from "../api/categories/category.model";
import { UserModel } from "../api/users/user.model";
import ProductService from "../api/products/product.service";
import CategoryService from "../api/categories/category.service";
import UserService from "../api/users/user.service";

// Model
const productModel = new ProductModel();
const categoryModel = new CategoryModel();
const userModel = new UserModel();

// Service
const productService = new ProductService(productModel, categoryModel);
const categoryService = new CategoryService(categoryModel);
const userService = new UserService(userModel);

export { productService, categoryService, userService, userModel };
