import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    // required: false,
    trim: true,
  },
  price: {
    type: Number,
    required: false,
    min: 0,
  },
  link: {
    type: String,
    required: false,
  },
  heading: {
    type: String,
    required: false,
    default: "",
  },
  moddleNo: {
    type: String,
    required: false,
  },
  originalPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  position: { type: Number, default: 0 }, // Add position field

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", productSchema);
