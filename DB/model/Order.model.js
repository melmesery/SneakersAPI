import mongoose, { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: String, required: true },
    customerId: { type: String, required: true },
    paymentIntentId: { type: String },
    products: [
      {
        iproductId: { type: String },
        name: { type: String, required: true },
        brand: String,
        desc: String,
        price: { type: String, default: 1, required: true },
        image: { type: Object, required: true },
        cartQuantity: { type: Number },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    shipping: { type: Object, required: true },
    delivery_status: {
      type: String,
      default: "pending",
      enum: ["pending", "delivered", "dispatched"],
    },
    payment_status: { type: String, required: true },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;