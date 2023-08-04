import { roles } from "../../middleware/auth.js";

const endPoint = {
  create: [roles.User, roles.Admin, roles.SuperAdmin],
};

export default endPoint;
