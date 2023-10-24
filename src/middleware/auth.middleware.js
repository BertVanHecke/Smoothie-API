import jwt from "jsonwebtoken";
import { SMOOTHIE_API_KEY } from "../../config/config.js";

export const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");
  try {
    const decoded = jwt.verify(token, SMOOTHIE_API_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
