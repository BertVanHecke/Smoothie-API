import Joi from "joi";

const validateSmoothie = (smoothie) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    ingredients: Joi.array()
      .items(
        Joi.object({
          ingredient: Joi.string().min(2).max(50).required(),
          amount: Joi.number().required(),
          units: Joi.string().max(10).required(),
        })
      )
      .required(),
    steps: Joi.array().items(Joi.string().max(255).required()).required(),
  });

  return schema.validate(smoothie);
};

export default validateSmoothie;
