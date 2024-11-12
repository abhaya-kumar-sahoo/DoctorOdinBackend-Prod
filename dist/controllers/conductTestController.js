"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTest = exports.updateTest = exports.getTestById = exports.getAllTests = exports.createTest = void 0;
const conductTest_1 = require("../schemas/conductTest");
// Create a new test
const createTest = async (req, res) => {
    try {
        const { testName, testDetails, member } = req.body;
        if (!testName || !testDetails) {
            return res
                .status(400)
                .json({ message: "Test name and details are required" });
        }
        const newTest = new conductTest_1.ConductTest({
            testName,
            testDetails,
            user: req?.user?.userId,
            member,
        });
        await newTest.save();
        return res
            .status(201)
            .json({ message: "Test conducted successfully", test: newTest });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.createTest = createTest;
// Get all tests
const getAllTests = async (req, res) => {
    try {
        const { userId } = req?.user;
        const { name, startDate, endDate, date, page = 1, limit = 20 } = req.query;
        // Date filtering conditions
        const dateFilter = {};
        if (date) {
            // Filter for a specific date by creating a range from the start to the end of that day
            const specificDate = new Date(date);
            const nextDay = new Date(specificDate);
            nextDay.setDate(specificDate.getDate() + 1);
            dateFilter.$gte = specificDate;
            dateFilter.$lt = nextDay;
        }
        else {
            // If a date range is specified
            if (startDate) {
                dateFilter.$gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.$lte = new Date(endDate);
            }
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build the query with date filtering if provided
        const query = {
            user: userId,
            member: name,
            ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
        };
        const tests = await conductTest_1.ConductTest.find(query)
            .skip(skip)
            .limit(limitNum)
            .select("-user");
        return res.status(200).json(tests);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.getAllTests = getAllTests;
// Get a test by ID
const getTestById = async (req, res) => {
    try {
        const test = await conductTest_1.ConductTest.findOne({
            _id: req.params.id,
            user: req?.user?.userId,
        });
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json(test);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.getTestById = getTestById;
// Update a test by ID
const updateTest = async (req, res) => {
    try {
        const { testName, testDetails } = req.body;
        if (!testName && !testDetails) {
            return res.status(400).json({
                message: "At least one of testName or testDetails is required to update",
            });
        }
        const updatedTest = await conductTest_1.ConductTest.findOneAndUpdate({ _id: req.params.id, user: req?.user?.userId }, { testName, testDetails, updatedAt: Date.now() }, { new: true });
        if (!updatedTest) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json(updatedTest);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.updateTest = updateTest;
// Delete a test by ID
const deleteTest = async (req, res) => {
    try {
        const deletedTest = await conductTest_1.ConductTest.findOneAndDelete({
            _id: req.params.id,
            user: req?.user?.userId,
        });
        if (!deletedTest) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json({ message: "Test deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};
exports.deleteTest = deleteTest;
//# sourceMappingURL=conductTestController.js.map