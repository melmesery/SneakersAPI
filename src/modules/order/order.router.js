import express, { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "../order/order.validation.js";
import * as orderController from "./controller/order.js";
import endPoint from "./order.endPoint.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post(
  "/create-checkout-session",
  auth(endPoint.create),
  orderController.customers
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  orderController.webhook
);

router.get("/", validation(validators.ordersList), orderController.ordersList);

router.get("/stats", orderController.stats);

router.get("/earnings", orderController.earnings);

router.get("/all-time-earnings", orderController.allTimeEarnings);

router.get("/week-sales", orderController.weekSales);

router.patch(
  "/:id",
  validation(validators.updateOrderStatus),

  orderController.updateOrderStatus
);

router.get("/:id", validation(validators.getOrder), orderController.getOrder);

export default router;
