import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const token = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const signup = joi
  .object({
    userName: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")).required(),
    key: joi.string().allow(""),
  })
  .required();

export const login = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();
