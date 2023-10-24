import { User } from "../model/user.model.js";
import { validateUser } from "../joi/user.validate.js";
import _ from "lodash";
import bcrypt from "bcrypt";
import { checkEmail } from "../utils/index.js";

const { pick } = _;
const { genSalt, hash } = bcrypt;

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    console.log("@user.controller.js -> getUser: " + error);
  }
};

export const updateUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = new User(pick(req.body, ["name", "email", "password"]));

  try {
    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    user = {
      name: user.name,
      email: user.email,
      password: user.password,
    };

    user = await User.findByIdAndUpdate(req.user._id, user, { new: true }).select("-password");
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
  } catch (error) {
    console.log("@user.controller.js -> updateUser: " + error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort("email").select("-password");
    res.send(users);
  } catch (error) {
    console.log("@user.controller.js -> getAllUsers: " + error);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user)
      return res.status(404).send("The user with the given ID was not found.");
    res.send(user);
  } catch (error) {
    console.log("@user.controller.js -> deleteUser: " + error);
  }
};
