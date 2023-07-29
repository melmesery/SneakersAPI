import { roles } from "../../middleware/auth.js";

const endPoint = {
  createCart: [roles.SuperAdmin, roles.Admin, roles.User],
  cartFetch: [roles.SuperAdmin, roles.Admin, roles.User],
};

export default endPoint;
