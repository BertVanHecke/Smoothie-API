import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
dotenv.config({
  path: `${path.dirname(__filename)}/${process.env.NODE_ENV}.env`,
});

export const NODE_ENV = process.env.NODE_ENV || "development";
export const HOST = process.env.HOST || "localhost";
export const PORT = process.env.PORT || 3000;
export const SMOOTHIE_API_KEY = process.env.SMOOTHIE_API_KEY;
export const TEST_ACCOUNT_EMAIL_NORMAL =
  process.env.TEST_ACCOUNT_EMAIL_NORMAL || "";
export const TEST_ACCOUNT_PASSWORD_NORMAL =
  process.env.TEST_ACCOUNT_PASSWORD_NORMAL || "";
export const TEST_ACCOUNT_EMAIL_ADMIN =
  process.env.TEST_ACCOUNT_EMAIL_ADMIN || "";
export const TEST_ACCOUNT_PASSWORD_ADMIN =
  process.env.TEST_ACCOUNT_PASSWORD_ADMIN || "";
export const MONGODB_URI = process.env.MONGODB_URI;
