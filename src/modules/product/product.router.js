import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileUpload, fileValidation } from "../../utils/CloudinaryMulter.js";
import * as validators from "../product/product.validation.js";
import * as productController from "./controller/product.js";
import endPoint from "./product.endPoint.js";

const router = Router();

router.get("/", productController.productList);

router.get(
  "/:id",
  validation(validators.viewProduct),
  productController.viewProduct
);

router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validators.deleteProduct),
  productController.deleteProduct
);

router.put(
  "/:id",
  fileUpload(fileValidation.image).single("image"),
  auth(endPoint.edit),
  validation(validators.editProduct),
  productController.editProduct
);

router.post(
  "/",
  fileUpload(fileValidation.image).single("image"),
  auth(endPoint.create),
  validation(validators.createProduct),
  productController.createProduct
);

export default router;
