import { Router } from "express";
const router = Router();
import {
  getIngredients,
  getIngredient,
  updateIngredient,
  createIngredient,
  deleteIngredient,
} from "../controllers/ingredient.controller.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { auth } from "../middleware/auth.middleware.js";
import { routes } from "../utils/index.js";

router.get(routes.endpoints.ingredients.getIngredients, getIngredients);

router.get(routes.endpoints.ingredients.getIngredient, getIngredient);

router.put(
  routes.endpoints.ingredients.updateIngredient,
  auth,
  updateIngredient
);

router.post(
  routes.endpoints.ingredients.createIngredient,
  auth,
  createIngredient
);

router.delete(
  routes.endpoints.ingredients.deleteIngredient,
  [auth, isAdmin],
  deleteIngredient
);

export default router;
