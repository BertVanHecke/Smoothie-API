import Smoothie from "../model/smoothie.model.js";
import validateSmoothie from "../joi/smoothie.validate.js";

export const getSmoothies = async (req, res) => {
  try {
    const smoothies = await Smoothie.find()
      .populate({
        path: "ingredients",
        populate: { path: "ingredient", model: "Ingredient" },
      })
      .sort("name");
    res.send(smoothies);
  } catch (error) {
    console.log("@smoothie.controller.js -> getSmoothies: " + error);
  }
};

export const getSmoothie = async (req, res) => {
  const { id } = req.params;
  try {
    const smoothie = await Smoothie.findById(id);
    if (!smoothie)
      return res
        .status(404)
        .send("The smoothie with the given ID was not found.");
    res.send(smoothie);
  } catch (error) {
    console.log("@smoothie.controller.js -> getSmoothie: " + error);
  }
};

export const updateSmoothie = async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, steps } = req.body;

  const { error } = validateSmoothie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const smoothie = await Smoothie.findByIdAndUpdate(
      id,
      { name, ingredients, steps },
      { new: true }
    );
    if (!smoothie)
      return res
        .status(404)
        .send("The smoothie with the given ID was not found.");
    res.send(smoothie);
  } catch (error) {
    console.log("@smoothie.controller.js -> updateSmoothie: " + error);
  }
};

export const createSmoothie = async (req, res) => {
  const { name, ingredients, steps } = req.body;

  const { error } = validateSmoothie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let smoothie = new Smoothie({
    name,
    ingredients,
    steps,
  });

  try {
    smoothie = await smoothie.save();
    res.send(smoothie);
  } catch (error) {
    console.log("@smoothie.controller.js -> createSmoothie: " + error);
  }
};

export const deleteSmoothie = async (req, res) => {
  const { id } = req.params;
  try {
    const smoothie = await Smoothie.findByIdAndRemove(id);
    if (!smoothie)
      return res
        .status(404)
        .send("The smoothie with the given ID was not found.");
    res.send(smoothie);
  } catch (error) {
    console.log("@smoothie.controller.js -> deleteSmoothie: " + error);
  }
};
