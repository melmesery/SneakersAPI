import { roles } from "../../middleware/auth.js";

const endPoint = {
  delete: [roles.Admin, roles.SuperAdmin],
  edit: [roles.Admin, roles.SuperAdmin, roles.Tester],
  create: [roles.Admin, roles.SuperAdmin, roles.Tester],
};

export default endPoint;
