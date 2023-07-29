import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import endPoint from "./cart.endPoint.js";
import * as cartController from "./controller/cart.js";

const router = Router();

router.get("/", auth(endPoint.cartFetch), cartController.cartFetch);

router.post("/", auth(endPoint.createCart), cartController.createCart);

export default router;
