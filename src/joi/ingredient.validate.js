import Joi from "joi";

export const validateIngredient = (ingredient) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
    });

    return schema.validate(ingredient);
  } catch (error) {
    console.log("@ingredient.validate.js -> validateIngredient: " + error);
  }
};
