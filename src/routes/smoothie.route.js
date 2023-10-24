import { Router } from "express";
const router = Router();
import {
  getSmoothies,
  getSmoothie,
  updateSmoothie,
  createSmoothie,
  deleteSmoothie,
} from "../controllers/smoothie.controller.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { auth } from "../middleware/auth.middleware.js";
import { routes } from "../utils/index.js";

router.get(routes.endpoints.smoothies.getSmoothies, getSmoothies);

router.get(routes.endpoints.smoothies.getSmoothie, getSmoothie);

router.put(routes.endpoints.smoothies.updateSmoothie, auth, updateSmoothie);

router.post(routes.endpoints.smoothies.createSmoothie, auth, createSmoothie);

router.delete(
  routes.endpoints.smoothies.deleteSmoothie,
  [auth, isAdmin],
  deleteSmoothie
);

export default router;
