"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTest = exports.updateTest = exports.getTestById = exports.getAllTests = exports.createTest = void 0;
const conductTest_1 = require("../schemas/conductTest");
// Create a new test
const createTest = async (req, res) => {
    try {
        const { testName, testDetails } = req.body;
        const newTest = new conductTest_1.ConductTest({
            testName,
            testDetails,
        });
        await newTest.save();
        return res.status(201).json({ message: "Test conducted successfully", test: newTest });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createTest = createTest;
// Get all tests
const getAllTests = async (req, res) => {
    try {
        const tests = await conductTest_1.ConductTest.find();
        return res.status(200).json(tests);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getAllTests = getAllTests;
// Get a test by ID
const getTestById = async (req, res) => {
    try {
        const test = await conductTest_1.ConductTest.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json(test);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.getTestById = getTestById;
// Update a test by ID
const updateTest = async (req, res) => {
    try {
        const { testName, testDetails } = req.body;
        const updatedTest = await conductTest_1.ConductTest.findByIdAndUpdate(req.params.id, { testName, testDetails, updatedAt: Date.now() }, { new: true });
        if (!updatedTest) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json(updatedTest);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateTest = updateTest;
// Delete a test by ID
const deleteTest = async (req, res) => {
    try {
        const deletedTest = await conductTest_1.ConductTest.findByIdAndDelete(req.params.id);
        if (!deletedTest) {
            return res.status(404).json({ message: "Test not found" });
        }
        return res.status(200).json({ message: "Test deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.deleteTest = deleteTest;
//# sourceMappingURL=conductTestController.js.map