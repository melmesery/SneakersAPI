import { roles } from "../../middleware/auth.js";

const endPoint = {
  getUser: [roles.User, roles.Admin, roles.SuperAdmin, roles.Tester],
  blockUser: [roles.SuperAdmin, roles.Tester],
  updateUser: [roles.User, roles.Admin, roles.SuperAdmin, roles.Tester],
};

export default endPoint;
