import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const viewProduct = joi.object({
  id: generalFields.id,
});

export const deleteProduct = joi.object({
  id: generalFields.id,
});

export const createProduct = joi.object({
  name: joi.string().min(2).max(50).required(),
  desc: joi.string().min(2).max(15000).allow(""),
  price: joi.number().positive().min(1).required(),
  brand: generalFields.brand,
  gender: generalFields.gender,
  file: generalFields.file.required(),
});

export const editProduct = joi.object({
  id: generalFields.id,
  name: joi.string().min(2).max(50),
  desc: joi.string().min(2).max(15000),
  price: joi.number().positive().min(1),
  brand: generalFields.brand,
  gender: generalFields.gender,
  file: generalFields.file,
  image: generalFields.image,
});
