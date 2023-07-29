import mongoose, { model, Schema, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    products: [{ type: Object }],
    userId: { type: Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const wishlistModel =
  mongoose.models.Wishlist || model("Wishlist", wishlistSchema);
export default wishlistModel;
