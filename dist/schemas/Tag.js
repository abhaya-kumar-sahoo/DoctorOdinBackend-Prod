"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recordsSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true }, // get from token
    firstName: { type: String, required: true }, // it should come from  frontend
    lastName: { type: String, required: false },
});
const TagModel = mongoose_1.default.model("Tag", recordsSchema);
exports.default = TagModel;
//# sourceMappingURL=Tag.js.map