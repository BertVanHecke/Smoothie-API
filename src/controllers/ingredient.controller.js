import Ingredient from "../model/ingredient.model.js";
import { validateIngredient } from "../joi/ingredient.validate.js";

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort("name");
    res.send(ingredients);
  } catch (error) {
    console.log("@ingredient.controller.js -> getIngredients: " + error);
  }
};

export const getIngredient = async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient)
      return res
        .status(404)
        .send("The ingredient with the given ID was not found.");
    res.send(ingredient);
  } catch (error) {
    console.log("@ingredient.controller.js -> getIngredient: " + error);
  }
};

export const updateIngredient = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { error } = validateIngredient(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!ingredient)
      return res
        .status(404)
        .send("The ingredient with the given ID was not found.");
    res.send(ingredient);
  } catch (error) {
    console.log("@ingredient.controller.js -> updateIngredient: " + error);
  }
};

export const createIngredient = async (req, res) => {
  const { name } = req.body;

  const { error } = validateIngredient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let ingredient = new Ingredient({
    name,
  });

  try {
    ingredient = await ingredient.save();
    res.send(ingredient);
  } catch (error) {
    console.log("@ingredient.controller.js -> createIngredient: " + error);
  }
};

export const deleteIngredient = async (req, res) => {
  const { id } = req.params;
  try {
    const ingredient = await Ingredient.findByIdAndRemove(id);
    if (!ingredient)
      return res
        .status(404)
        .send("The ingredient with the given ID was not found.");
    res.send(ingredient);
  } catch (error) {
    console.log("@ingredient.controller.js -> deleteIngredient: " + error);
  }
};
