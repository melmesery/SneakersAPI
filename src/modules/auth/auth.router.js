import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "../auth/auth.validation.js";
import * as authController from "../auth/controller/auth.js";
const router = Router();

router.post("/signup", validation(validators.signup), authController.signUp);

router.get(
  "/confirmEmail/:token",
  validation(validators.token),
  authController.confirmEmail
);

router.get(
  "/newConfirmEmail/:token",
  validation(validators.token),
  authController.newConfirmEmail
);

router.post("/login", validation(validators.login), authController.login);

export default router;
