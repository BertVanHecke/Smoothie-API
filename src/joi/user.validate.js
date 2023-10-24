import Joi from "joi";

export const validateUser = (user) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
  } catch (error) {
    console.log("@user.validate.js -> validateUser: " + error);
  }
};
