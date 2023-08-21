import { roles } from "../../middleware/auth.js";

const endPoint = {
  createCart: [roles.SuperAdmin, roles.Admin, roles.User, roles.Tester],
  cartFetch: [roles.SuperAdmin, roles.Admin, roles.User, roles.Tester],
};

export default endPoint;
