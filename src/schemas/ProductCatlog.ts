import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  link: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
    default: "",
  },
  moddleNo: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  position: { type: Number, default: 0 }, // Add position field

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", productSchema);
