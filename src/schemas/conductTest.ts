import mongoose from "mongoose";

const ConductTestSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true,
    trim: true,
  },
  testDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    trim: true,
  },
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  member: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ConductTest = mongoose.model("testRecord", ConductTestSchema);
