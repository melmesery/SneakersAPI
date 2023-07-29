import mongoose, { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    products: [{ type: Object }],
    userId: { type: Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.models.Cart || model("Cart", cartSchema);
export default cartModel;
