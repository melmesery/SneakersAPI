import moment from "moment";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import orderModel from "../../../../DB/model/order.model.js";
import { asyncHandler } from "../../../utils/ErrorHandling.js";

const stripe = Stripe(
  "sk_test_51N0sHwLQx2XYtCqsDtlYyujklMnTqY3sRySWPZElzmSnoSk0CTWX5TJQ27CzUz6PogWRhSLygLrjYkFI5JENmiB6003hXCq0ye"
);
const customId = nanoid();

let endpointSecret;

endpointSecret =
  "whsec_cbc4f43e2c9353d5f278073bec34a6c95cf2d4128e92c8818a4b044c900d0c71";

export const customers = asyncHandler(async (req, res) => {
  const { cartItems, userId } = req.body;
  const customer = await stripe.customers.create({
    metadata: {
      userId,
      cart: JSON.stringify(cartItems),
    },
  });

  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.secure_url],
          metadata: {
            id: item._id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "EG"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 2000,
            currency: "usd",
          },
          display_name: "Next day air",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    customer: customer.id,
    line_items,
    mode: "payment",
    success_url: `http://localhost:5173/checkout-success/${customId}`,
    cancel_url: `http://localhost:5173/cart`,
  });

  return res.status(200).json({ url: session.url });
});

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  const newOrder = new orderModel({
    userId: customer.metadata.userId,
    customerId: data.customer,
    paymentIntentId: data.payment_intent,
    products: Items,
    subtotal: data.amount_subtotal,
    total: data.amount_total,
    shipping: data.customer_details,
    payment_status: data.payment_status,
  });

  try {
    const savedOrder = await newOrder.save();
  } catch (error) {
    return error;
  }
};

export const webhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createOrder(customer, data);
      })
      .catch((error) => {
        return error;
      });
  }

  res.send().end();
});

export const ordersList = asyncHandler(async (req, res, next) => {
  const { NEW } = req.query;
  const orders = NEW
    ? await orderModel.find().sort({ _id: -1 }).limit(4)
    : await orderModel.find().sort({ _id: -1 });
  if (orders.length === 0) {
    return next(new Error("No Orders Found!", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", orders });
});

export const stats = asyncHandler(async (_, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD hh:mm:ss");
  const orders = await orderModel
    .aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ])
    .sort({ _id: -1 });
  return res.status(200).send(orders);
});

export const earnings = asyncHandler(async (_, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD hh:mm:ss");
  const income = await orderModel.aggregate([
    {
      $match: { createdAt: { $gte: new Date(previousMonth) } },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$total",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);
  return res.status(200).send(income);
});

export const allTimeEarnings = asyncHandler(async (_, res) => {
  const totals = await orderModel.aggregate([
    {
      $project: {
        sales: "$total",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$sales" },
      },
    },
  ]);
  return res.status(200).send(totals);
});

export const weekSales = asyncHandler(async (_, res) => {
  const previousMonth = moment()
    .day(moment().day() - 7)
    .format("YYYY-MM-DD hh:mm:ss");
  const sales = await orderModel
    .aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$sales" },
        },
      },
    ])
    .sort({ _id: -1 });
  return res.status(200).send(sales);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { delivery_status } = req.body;
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { delivery_status },
    {
      new: true,
    }
  );
  return res.status(200).json({ message: "Done", order });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new Error("No Order Found!", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", order });
});
