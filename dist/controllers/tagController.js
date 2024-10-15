"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTagsByUserId = exports.addTag = void 0;
const response_1 = require("../response");
const Tag_1 = __importDefault(require("../schemas/Tag"));
const addTag = async (req, res) => {
    try {
        const dataToInsert = req.body;
        const userId = req.user?.userId;
        console.log(req.user.userId);
        dataToInsert.userId = userId;
        const firstName = (dataToInsert.firstName).toUpperCase().trim();
        dataToInsert.firstName = firstName;
        const lastName = (dataToInsert.lastName).toUpperCase().trim();
        dataToInsert.lastName = lastName;
        const existingTag = await Tag_1.default.findOne({
            $and: [
                { userId: dataToInsert.userId },
                { firstName: dataToInsert.firstName }
            ]
        });
        if (existingTag) {
            return (0, response_1.response)(res, 409, "Tag already exists", false);
        }
        const tag = new Tag_1.default(dataToInsert);
        const result = await tag.save();
        return (0, response_1.response)(res, 201, "tag added successfully", true);
    }
    catch (error) {
        return (0, response_1.response)(res, 500, "internal server error ", false, error.message);
    }
};
exports.addTag = addTag;
//this will give  all tags of a userId:
const getAllTagsByUserId = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const tagsData = await Tag_1.default.find({ userId: userId });
        if (tagsData.length < 0) {
            return (0, response_1.response)(res, 404, "data not found", false);
        }
        return (0, response_1.response)(res, 200, "data founded successfully", true, tagsData);
    }
    catch (error) {
        return (0, response_1.response)(res, 500, "internal server error ", false, error.message);
    }
};
exports.getAllTagsByUserId = getAllTagsByUserId;
//# sourceMappingURL=tagController.js.map