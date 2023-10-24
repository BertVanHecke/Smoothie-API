import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { SMOOTHIE_API_KEY } from "../../config/config.js";
const { Schema, model } = mongoose;
const { sign } = jwt;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = sign(
    { _id: this._id, isAdmin: this.isAdmin },
    SMOOTHIE_API_KEY
  );
  return token;
};

const User = model("User", userSchema);
const _User = User;
export { _User as User };
