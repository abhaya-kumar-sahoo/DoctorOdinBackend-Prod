"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReportOfMultipleDevice = exports.generateReportForSingleInstrument = exports.getHistoryByDeviveId = exports.getHistory = exports.addRecord = void 0;
const Records_1 = __importDefault(require("../schemas/Records"));
const ProductCatlog_1 = require("../schemas/ProductCatlog");
const response_1 = require("../response");
const dbconnect_1 = __importDefault(require("../db/dbconnect"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const addRecord = async (req, res) => {
    try {
        //   console.log(req.user);
        let userId;
        if (req.user) {
            userId = req.user.userId;
        }
        req.body.userId = userId;
        const productData = await ProductCatlog_1.Product.findById({ _id: req.body?.deviceId });
        console.log(req.body);
        if (!productData) {
            return (0, response_1.response)(res, 404, " device data not found ", false);
        }
        const { name, moddleNo } = productData;
        req.body.deviceName = name;
        req.body.deviceModdle = moddleNo;
        console.log(req.body, "req.body");
        const record = new Records_1.default(req.body);
        record.save();
        return (0, response_1.response)(res, 201, "record added success", true);
    }
    catch (error) {
        return (0, response_1.response)(res, 500, "internal server error", false, error.message);
    }
};
exports.addRecord = addRecord;
//thsi gives latest reading of each device used by that user  ot its tag person
const getHistory = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body.tagId;
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const skip = (page - 1) * limit;
        const result = await Records_1.default.aggregate([
            {
                $match: { userId: userId, tagId: tagId }
            },
            {
                $group: {
                    _id: "$deviceId",
                    lastreading: { $last: "$createdDate" }, // Include date field
                    otherFields: { $last: "$$ROOT" } // Include other fields from the last document in each group
                }
            },
            {
                $replaceRoot: { newRoot: "$otherFields" } // Replace the root with the document containing all fields
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
        if (result.length < 0) {
            return (0, response_1.response)(res, 404, "data not found", false);
        }
        return (0, response_1.response)(res, 200, "data founded successfully", true, result);
    }
    catch (error) {
        return (0, response_1.response)(res, 500, "internal server error", false, error.message);
    }
};
exports.getHistory = getHistory;
const getHistoryByDeviveId = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;
        const deviceId = req.body?.deviceId;
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const skip = (page - 1) * limit;
        const result = await Records_1.default.find({ userId: userId, tagId: tagId, deviceId: deviceId }).sort({ createdDate: -1 }).skip(skip).limit(limit);
        if (result.length < 0) {
            return (0, response_1.response)(res, 404, "data not found", false);
        }
        return (0, response_1.response)(res, 200, "data founded successfully", true, result);
    }
    catch (error) {
        return (0, response_1.response)(res, 500, "internal server error", false, error.message);
    }
};
exports.getHistoryByDeviveId = getHistoryByDeviveId;
const generateReportForSingleInstrument = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;
        const deviceId = req.body?.deviceId;
        const latestCount = req.body.latestCount || 20; // by this  limiting report generation for 20 latest records of that instrument for that user.
        const result = await Records_1.default.find({ userId: userId, tagId: tagId, deviceId: deviceId }).sort({ createdDate: -1 }).limit(latestCount);
        if (result.length < 0) {
            return (0, response_1.response)(res, 404, "data not found", false);
        }
        const doc = new pdfkit_1.default();
        // <----------- USING PDF KIT  STYLING---------->  //
        doc.fontSize(12);
        doc.font('Helvetica-Bold').text('Report', { align: 'center' }).font('Helvetica');
        result.forEach((record, index) => {
            doc.moveDown().text(`${index + 1}:`).moveDown(0.5)
                .text(`deviceName: ${record.deviceName}`)
                .text(`reading: ${JSON.stringify(record.reading)}`)
                .text(`createdDate: ${record.createdDate}`);
        });
        res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        doc.end();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        return (0, response_1.response)(res, 500, "internal server error", false, error.message);
    }
};
exports.generateReportForSingleInstrument = generateReportForSingleInstrument;
const generateReportOfMultipleDevice = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;
        const deviceIds = req.body.deviceIds;
        const latestCount = req.body?.latestCount || 20; // this is for  generating reports of some fixed no of documents for each instrument . since there will large records for each instrument so that coulbe time consuming and also not reasonable . But if  user want ot get reports of all then we will make that also
        let result = deviceIds.map(async (id) => {
            return await Records_1.default.find({ userId: userId, tagId: tagId, deviceId: id }).sort({ createdDate: -1 }).limit(latestCount);
        });
        result = await Promise.all(result);
        if (result.length < 0) {
            return (0, response_1.response)(res, 404, "data not found", false);
        }
        // console.log("result", result);
        let dataForReport = [];
        result.map((t) => {
            dataForReport = [...dataForReport, { deviceName: "AnotherDevice" }, ...t];
        });
        const doc = new pdfkit_1.default();
        // <----------- USING PDF KIT  STYLING---------->  //
        doc.fontSize(12);
        doc.font('Helvetica-Bold').text('Report', { align: 'center' }).font('Helvetica');
        let sNo = 1; // for showing SNo for each records which are showing as doument in report 
        dataForReport.forEach((record, index) => {
            if (record.deviceName === "AnotherDevice") {
                doc.moveDown().text("BELOW REPORTS ARE OF ONE DEVICE").moveDown(0.5);
            }
            else {
                doc.moveDown().text(`${sNo}`).moveDown(0.5)
                    .text(`deviceName: ${record.deviceName}`)
                    .text(`reading: ${JSON.stringify(record.reading)}`)
                    .text(`createdDate: ${record.createdDate}`);
                sNo++;
            }
        });
        res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);
        doc.end();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        return (0, response_1.response)(res, 500, "internal server error", false, error.message);
    }
};
exports.generateReportOfMultipleDevice = generateReportOfMultipleDevice;
//# sourceMappingURL=UserController.js.map