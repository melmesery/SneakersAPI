import productModel from "../../../../DB/model/Product.model.js";
import wishlistModel from "../../../../DB/model/Wishlist.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";
import { nanoid } from "nanoid";

export const wishlistFetch = asyncHandler(async (req, res, next) => {
  const wishlist = await wishlistModel.findOne({ userId: req.user._id });
  if (wishlist) {
    return res.status(200).json({ message: "Done", wishlist });
  }
  return next(new Error("No whislist Found", { cause: 400 }));
});

export const addToWishlist = asyncHandler(async (req, res, next) => {
  let ID = nanoid();
  const product = await productModel.findById(req.params.id);
  product.ID = ID;
  if (product) {
    const wishlist = await wishlistModel.findOne({ userId: req.user._id });
    if (wishlist) {
      wishlist.products.push(product);
      await wishlist.save();
      return res.status(200).json({ message: "Done", wishlist });
    } else {
      const wishlist = await wishlistModel.create({
        products: [product],
        userId: req.user._id,
      });
      return res.status(201).json({ message: "Done", wishlist });
    }
  }
  return next(new Error("No product Found", { cause: 400 }));
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistModel.findOne({ userId: req.user._id });
  const { products } = wishlist;
  const newProducts = products.filter((product) => {
    return product.ID !== req.params.id;
  });
  wishlist.products = newProducts;
  await wishlist.save();
  return res.status(200).json({ message: "Done", wishlist });
});
