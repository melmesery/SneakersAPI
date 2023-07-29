import cors from "cors";
import connectDB from "../DB/connection.js";
import authRouter from "./modules/auth/auth.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import orderRouter from "./modules/order/order.router.js";
import productRouter from "./modules/product/product.router.js";
import userRouter from "./modules/user/user.router.js";
import wishlistRouter from "./modules/wishlist/wishlist.router.js";
import { globalErrHandling } from "./utils/ErrorHandling.js";

const initApp = (app, express) => {
  app.use(cors());

  app.use((req, res, next) => {
    if (req.originalUrl == "/order/webhook") {
      next();
    } else {
      express.json({})(req, res, next);
    }
  });

  app.get("/", (_, res) => res.send("Hello World!"));
  app.use(`/product`, productRouter);
  app.use(`/wishlist`, wishlistRouter);
  app.use(`/cart`, cartRouter);
  app.use(`/order`, orderRouter);
  app.use(`/auth`, authRouter);
  app.use(`/user`, userRouter);

  app.all("*", (_, res) => {
    res.send("In-valid Routing");
  });

  app.use(globalErrHandling);
  connectDB();
};

export default initApp;
