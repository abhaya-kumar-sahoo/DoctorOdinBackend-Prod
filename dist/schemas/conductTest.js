"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConductTest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ConductTestSchema = new mongoose_1.default.Schema({
    testName: {
        type: String,
        required: true,
        trim: true,
    },
    testDetails: {
        type: mongoose_1.default.Schema.Types.Mixed,
        required: true,
        trim: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.ConductTest = mongoose_1.default.model("testRecord", ConductTestSchema);
//# sourceMappingURL=conductTest.js.map