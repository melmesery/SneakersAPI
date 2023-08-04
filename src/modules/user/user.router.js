import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as userController from "./controller/user.js";
import endPoint from "./user.endPoint.js";

const router = Router();

router.get("/stats", userController.stats);

router.get("/", userController.getAllUsers);

router.get("/:id", auth(endPoint.getUser), userController.getUser);

router.patch("/:id", auth(endPoint.blockUser), userController.blockUser);

router.put("/:id", auth(endPoint.updateUser), userController.updateUser);

export default router;
