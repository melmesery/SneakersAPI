import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import endPoint from "./wishlist.endPoint.js";
import * as wishlistController from "./controller/wishlist.js";

const router = Router();

router.get("/", auth(endPoint.wishlistFetch), wishlistController.wishlistFetch);

router.post(
  "/:id",
  auth(endPoint.addToWishlist),
  wishlistController.addToWishlist
);

router.delete(
  "/:id",
  auth(endPoint.removeFromWishlist),
  wishlistController.removeFromWishlist
);

export default router;
