import { roles } from "../../middleware/auth.js";

const endPoint = {
  delete: [roles.Admin, roles.SuperAdmin],
  edit: [roles.Admin, roles.SuperAdmin],
  create: [roles.Admin, roles.SuperAdmin],
};

export default endPoint;
