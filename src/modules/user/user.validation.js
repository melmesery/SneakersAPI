import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const updateUser = joi
  .object({
    id: generalFields.id,
    userName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();
