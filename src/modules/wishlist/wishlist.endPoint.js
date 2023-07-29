import { roles } from "../../middleware/auth.js";

const endPoint = {
  wishlistFetch: [roles.User, roles.Admin, roles.SuperAdmin],
  addToWishlist: [roles.User, roles.Admin, roles.SuperAdmin],
  removeFromWishlist: [roles.User, roles.Admin, roles.SuperAdmin],
};

export default endPoint;
