import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const ordersList = joi
  .object({
    new: joi.boolean(),
  })
  .required();

export const updateOrderStatus = joi
  .object({
    id: generalFields.id,
    delivery_status: joi.string(),
  })
  .required();

export const getOrder = joi
  .object({
    id: generalFields.id,
  })
  .required();
