import joi from "joi";
import { Types } from "mongoose";

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("In-valid objectId");
};

export const generalFields = {
  userName: joi.string().min(2).max(20).required().messages({
    "any.required": "Please Enter Username",
    "string.base": "Username Accepts Only Alphanum",
    "string.empty": "Please Fill Username",
  }),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().required(),
  email: joi
    .string()
    .email({ maxDomainSegments: 3, tlds: { allow: ["com", "net"] } })
    .required(),
  gender: joi.string(),
  brand: joi.string(),
  image: joi.object(),
  id: joi.string().custom(validateObjectId).required(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const inputsData = { ...req.body, ...req.query, ...req.params };
    if (req.file || req.files) {
      inputsData.file = req.file || req.files;
    }
    const validationResult = schema.validate(inputsData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        message: "Validation Error",
        validationErr: validationResult.error?.details,
      });
    }
    return next();
  };
};
