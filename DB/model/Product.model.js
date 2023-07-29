import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, default: 1, required: true },
    image: { type: Object, required: true },
    gender: { type: String, enum: ["male", "female"] },
    desc: String,
    brand: String,
    customId: String,
    ID: String,
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
