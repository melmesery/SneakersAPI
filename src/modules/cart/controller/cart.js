import cartModel from "../../../../DB/model/Cart.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

export const cartFetch = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (cart) {
    return res.status(200).json({ message: "Done", cart });
  }
  return next(new Error("No cart Found", { cause: 400 }));
});

export const createCart = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (cart) {
    const addCart = await cartModel.updateOne(
      { _id: cart._id },
      {
        products: [...req.body.args],
      }
    );
    return res.status(200).json({ message: "Done", addCart });
  } else {
    const addCart = await cartModel.create({
      products: [...req.body.args],
      userId: req.user._id,
    });
    return res.status(200).json({ message: "Done", addCart });
  }
});
