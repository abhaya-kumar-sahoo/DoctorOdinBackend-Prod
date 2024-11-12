import { Request, Response } from "express";
import { ConductTest } from "../schemas/conductTest";

// Type definition for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

// Create a new test
export const createTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { testName, testDetails, member } = req.body;

    if (!testName || !testDetails) {
      return res
        .status(400)
        .json({ message: "Test name and details are required" });
    }

    const newTest = new ConductTest({
      testName,
      testDetails,
      user: req?.user?.userId,
      member,
    });

    await newTest.save();
    return res
      .status(201)
      .json({ message: "Test conducted successfully", test: newTest });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Get all tests
export const getAllTests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req?.user;
    const { name, startDate, endDate, date, page = 1, limit = 20 } = req.query;

    // Date filtering conditions
    const dateFilter: any = {};

    if (date) {
      // Filter for a specific date by creating a range from the start to the end of that day
      const specificDate = new Date(date as string);
      const nextDay = new Date(specificDate);
      nextDay.setDate(specificDate.getDate() + 1);

      dateFilter.$gte = specificDate;
      dateFilter.$lt = nextDay;
    } else {
      // If a date range is specified
      if (startDate) {
        dateFilter.$gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate as string);
      }
    }
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    // Build the query with date filtering if provided
    const query = {
      user: userId,
      member: name,
      ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
    };

    const tests = await ConductTest.find(query)
      .skip(skip)
      .limit(limitNum)
      .select("-user");
    return res.status(200).json(tests);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Get a test by ID
export const getTestById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const test = await ConductTest.findOne({
      _id: req.params.id,
      user: req?.user?.userId,
    });
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json(test);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Update a test by ID
export const updateTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { testName, testDetails } = req.body;

    if (!testName && !testDetails) {
      return res.status(400).json({
        message:
          "At least one of testName or testDetails is required to update",
      });
    }

    const updatedTest = await ConductTest.findOneAndUpdate(
      { _id: req.params.id, user: req?.user?.userId },
      { testName, testDetails, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json(updatedTest);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// Delete a test by ID
export const deleteTest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedTest = await ConductTest.findOneAndDelete({
      _id: req.params.id,
      user: req?.user?.userId,
    });
    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(200).json({ message: "Test deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};
