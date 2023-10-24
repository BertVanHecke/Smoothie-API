import { Router } from "express";
const router = Router();
import { register, logout, login } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { routes } from "../utils/index.js";

router.post(routes.endpoints.auth.register, register);

router.get(routes.endpoints.auth.logout, auth, logout);

router.post(routes.endpoints.auth.login, login);

export default router;
