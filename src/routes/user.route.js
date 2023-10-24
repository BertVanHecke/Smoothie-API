import { Router } from "express";
const router = Router();
import {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { routes } from "../utils/index.js";

router.get(routes.endpoints.users.getMe, auth, getUser);

router.put(routes.endpoints.users.updateUser, auth, updateUser);

router.get(routes.endpoints.users.getUsers, [auth, isAdmin], getAllUsers);

router.delete(routes.endpoints.users.deleteUser, [auth, isAdmin], deleteUser);

export default router;
