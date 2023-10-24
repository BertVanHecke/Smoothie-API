import { User } from "../model/user.model.js";
import { validateUserAuth } from "../joi/auth.validate.js";
import { validateUser } from "../joi/user.validate.js";
import _ from "lodash";
import bcrypt from "bcrypt";

const { compare, genSalt, hash } = bcrypt;
const { pick } = _;

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateUserAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log("@auth.controller.js -> login: " + error);
  }
};

export const register = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User(pick(req.body, ["name", "email", "password"]));

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.log("@auth.controller.js -> register: " + error);
  }
};

export const logout = async (req, res) => {
  res.header("x-auth-token", "").redirect("http://localhost:3000/");
};
