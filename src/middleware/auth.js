import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../utils/ErrorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

export const roles = {
  SuperAdmin: "Super Admin",
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, _, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return next(new Error("In-valid Bearer Key", { cause: 400 }));
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    if (!token) {
      return next(new Error("In-valid Token", { cause: 400 }));
    }
    const decoded = verifyToken({ token });
    if (!decoded?._id) {
      return next(new Error("In-valid Token Payload", { cause: 400 }));
    }
    const authUser = await userModel
      .findById(decoded._id)
      .select("userName email image role changePasswordTime");
    if (!authUser) {
      return next(new Error("Not Authenticated Account", { cause: 401 }));
    }
    if (parseInt(authUser.changePasswordTime?.getTime() / 1000) > decoded.iat) {
      return next(new Error("Expired Token", { cause: 400 }));
    }
    if (!accessRoles.includes(authUser.role)) {
      return next(new Error("Not Authorized Account", { cause: 403 }));
    }
    req.user = authUser;
    return next();
  });
};
