import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
});

export default models.Ingredient || model("Ingredient", ingredientSchema);
