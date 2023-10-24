import { NODE_ENV, HOST, PORT, MONGODB_URI } from "./config/config.js";
import express, { json } from "express";
export const app = express();
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";

console.log(`NODE_ENV=${NODE_ENV}`);

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error("Can't connect to MongoDB...", err));

import home from "./src/routes/home.route.js";
import ingredients from "./src/routes/ingredient.route.js";
import smoothies from "./src/routes/smoothie.route.js";
import users from "./src/routes/user.route.js";
import auth from "./src/routes/auth.route.js";

import { routes } from "./src/utils/index.js";

app.use(json());
app.use(helmet());
app.use(morgan("dev"));
app.set("view engine", "pug");

//default route
app.use("/", home);

//ingredient routes
app.use(routes.subdirectorys.ingredients, ingredients);

//smoothie routes
app.use(routes.subdirectorys.smoothies, smoothies);

//user routes
app.use(routes.subdirectorys.users, users);

//authentication routes
app.use(routes.subdirectorys.auth, auth);

app
  .listen(PORT, () => console.log(`Listening on http://${HOST}:${PORT}`))
  //   Fix the Error EADDRINUSE
  .on("error", function (err) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      // this is only called on ctrl+c, not restart
      process.kill(process.pid, "SIGINT");
    });
  });
