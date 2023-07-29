import { roles } from "../../middleware/auth.js";

const endPoint = {
  getUser: [roles.User, roles.Admin, roles.SuperAdmin],
  blockUser: [roles.SuperAdmin],
  updateUser: [roles.User, roles.Admin, roles.SuperAdmin],
};

export default endPoint;
