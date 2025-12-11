import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "./product.model";
import { CategoryModel } from "../categories/category.model";
import { Product, NewProduct } from "./product.schema";
import { NotFoundError, AppError } from "../../utils/appError";
import {
  TCreateProduct,
  TUpdateProduct,
  TGetProductsQuery,
  TProductWithCategory,
  TPaginatedResponse,
  TBulkPriceUpdate,
} from "./product.types";

export default class ProductService {
  constructor(
    private productModel: ProductModel,
    private categoryModel: CategoryModel
  ) {}

  private async populateCategory(
    product: Product
  ): Promise<TProductWithCategory> {
    const category = this.categoryModel.findById(product.categoryId);
    return {
      ...product,
      category: category ? { id: category.id, name: category.name } : undefined,
    };
  }

  private async populateCategories(
    productList: Product[]
  ): Promise<TProductWithCategory[]> {
    const categoryIds = [...new Set(productList.map((p) => p.categoryId))];
    const categoryList = this.categoryModel.findByIds(categoryIds);

    const categoryMap = new Map(
      categoryList.map((c) => [c.id, { id: c.id, name: c.name }])
    );

    return productList.map((product) => ({
      ...product,
      category: categoryMap.get(product.categoryId),
    }));
  }

  async createProduct(props: TCreateProduct): Promise<TProductWithCategory> {
    const category = this.categoryModel.findById(props.categoryId);

    if (!category) {
      throw new AppError(`Category with id ${props.categoryId} not found`, 400);
    }

    const newProduct: NewProduct = {
      id: uuidv4(),
      name: props.name,
      price: props.price,
      categoryId: props.categoryId,
      description: props.description,
    };

    this.productModel.create(newProduct);
    const product = this.productModel.findById(newProduct.id);

    return this.populateCategory(product!);
  }

  async getProducts(
    query: TGetProductsQuery
  ): Promise<TPaginatedResponse<TProductWithCategory>> {
    const { page, limit, search } = query;

    const whereCondition = this.productModel.buildSearchCondition(search);

    if (page === undefined && limit === undefined) {
      const productList = this.productModel.findAll({
        condition: whereCondition,
      });

      return {
        data: await this.populateCategories(productList),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: productList.length,
          itemsPerPage: productList.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const currentPage = page || 1;
    const itemsPerPage = limit || 10;
    const offset = (currentPage - 1) * itemsPerPage;

    const productList = this.productModel.findAll({
      condition: whereCondition,
      limit: itemsPerPage,
      offset,
    });

    const totalItems = this.productModel.count(whereCondition);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: await this.populateCategories(productList),
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  }

  async getProductById(id: string): Promise<TProductWithCategory> {
    const product = this.productModel.findById(id);

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return this.populateCategory(product);
  }

  async updateProduct(
    id: string,
    props: TUpdateProduct
  ): Promise<TProductWithCategory> {
    if (props.categoryId) {
      const category = this.categoryModel.findById(props.categoryId);

      if (!category) {
        throw new AppError(
          `Category with id ${props.categoryId} not found`,
          400
        );
      }
    }

    const changes = this.productModel.update(id, props);

    if (changes === 0) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return this.getProductById(id);
  }

  async deleteProduct(id: string): Promise<void> {
    const changes = this.productModel.softDelete(id);

    if (changes === 0) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
  }

  async bulkPriceUpdate({
    productIds,
    discountPercentage,
  }: TBulkPriceUpdate): Promise<TProductWithCategory[]> {
    const discountMultiplier = 1 - discountPercentage / 100;
    const productsToUpdate = this.productModel.findByIds(productIds);

    for (const product of productsToUpdate) {
      const newPrice =
        Math.round(product.price * discountMultiplier * 100) / 100;
      this.productModel.update(product.id, { price: newPrice });
    }

    const updatedProducts = this.productModel.findByIds(productIds);
    return this.populateCategories(updatedProducts);
  }
}
