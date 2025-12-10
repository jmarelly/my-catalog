import { Router } from "express";
import CategoryController from "./category.controller";
import { catchAsync } from "../../error-handlers/catchAsync";
import { categoryService } from "../../container";

const router = Router();
const categoryController = new CategoryController(categoryService);

router.get("/", catchAsync(categoryController.getCategories));

export default router;
