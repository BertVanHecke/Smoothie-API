import Joi from "joi";

export const validateUserAuth = (details) => {
  try {
    const schema = Joi.object({
      email: Joi.string().min(5).max(50).email().required(),
      password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(details);
  } catch (error) {
    console.log("@auth.validate.js -> validateUserAuth: " + error);
  }
};
