import { roles } from "../../middleware/auth.js";

const endPoint = {
  wishlistFetch: [roles.User, roles.Admin, roles.SuperAdmin, roles.Tester],
  addToWishlist: [roles.User, roles.Admin, roles.SuperAdmin, roles.Tester],
  removeFromWishlist: [roles.User, roles.Admin, roles.SuperAdmin, roles.Tester],
};

export default endPoint;
