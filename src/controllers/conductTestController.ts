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
// Get all tests
export const getAllTests = async (req: Request, res: Response) => {
    try {
      const tests = await ConductTest.find();
      return res.status(200).json(tests);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
 // Get a test by ID
export const getTestById = async (req: Request, res: Response) => {
    try {
      const test = await ConductTest.findById(req.params.id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      return res.status(200).json(test);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  // Update a test by ID
  export const updateTest = async (req: Request, res: Response) => {
    try {
      const { testName, testDetails } = req.body;
  
      const updatedTest = await ConductTest.findByIdAndUpdate(
        req.params.id,
        { testName, testDetails, updatedAt: Date.now() },
        { new: true }
      );
  
      if (!updatedTest) {
        return res.status(404).json({ message: "Test not found" });
      }
  
      return res.status(200).json(updatedTest);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a test by ID
  export const deleteTest = async (req: Request, res: Response) => {
    try {
      const deletedTest = await ConductTest.findByIdAndDelete(req.params.id);
      if (!deletedTest) {
        return res.status(404).json({ message: "Test not found" });
      }
      return res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };