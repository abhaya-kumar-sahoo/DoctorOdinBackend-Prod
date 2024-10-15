"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recordsSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true }, // get from token
    tagId: { type: String, required: true }, // it should come from  frontend
    deviceId: { type: String, required: true },
    deviceName: { type: String, required: true },
    deviceModdle: { type: String, required: true },
    reading: { type: Object, required: true },
    createdDate: { type: Date, required: true, default: Date.now() }, //should come from frontend
});
const RecordsModel = mongoose_1.default.model("Record", recordsSchema);
exports.default = RecordsModel;
//# sourceMappingURL=Records.js.map