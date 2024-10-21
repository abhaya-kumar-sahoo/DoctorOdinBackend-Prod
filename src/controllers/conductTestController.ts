import { Request, Response } from "express";
import { ConductTest } from "../schemas/conductTest"; 

// Create a new test
export const createTest = async (req: Request, res: Response) => {
  try {
    const { testName, testDetails } = req.body;

    const newTest = new ConductTest({
      testName,
      testDetails,
    });

    await newTest.save();
    return res.status(201).json({ message: "Test conducted successfully", test: newTest });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
