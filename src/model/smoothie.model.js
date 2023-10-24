import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const smoothieSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
  },
  ingredients: {
    type: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "ingredient",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        units: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 10,
        },
      },
    ],
    required: true,
  },
  steps: {
    type: [
      {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
      },
    ],
    required: true,
  },
});

export default models.Smoothie || model("Smoothie", smoothieSchema);
