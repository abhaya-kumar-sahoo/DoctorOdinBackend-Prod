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
  heading: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", productSchema);
