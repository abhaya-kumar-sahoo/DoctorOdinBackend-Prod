import { Request, Response } from "express";
import RecordsModel from "../schemas/Records"
import { Product } from "../schemas/ProductCatlog";
import { response } from "../response";
import dbConnect from "@Odin/db/dbconnect";

import PDFDocument from "pdfkit";


export const addRecord = async (req: any, res: Response) => {
    try {
        //   console.log(req.user);
        let userId;
        if (req.user) {
            userId = req.user.userId;
        }

        req.body.userId = userId;
        const productData = await Product.findById({ _id: req.body?.deviceId });
        console.log(req.body);

        if (!productData) {
            return response(res, 404, " device data not found ", false);

        }
        const { name, moddleNo } = productData;

        req.body.deviceName = name;
        req.body.deviceModdle = moddleNo;

        console.log(req.body, "req.body");

        const record = new RecordsModel(req.body);
        record.save();

        return response(res, 201, "record added success", true);

    } catch (error) {
        return response(res, 500, "internal server error", false, error.message)
    }
}

//thsi gives latest reading of each device used by that user  ot its tag person
export const getHistory = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body.tagId;
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const skip = (page - 1) * limit;

        const result = await RecordsModel.aggregate([
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
            return response(res, 404, "data not found", false);
        }
        return response(res, 200, "data founded successfully", true, result)
    } catch (error) {
        return response(res, 500, "internal server error", false, error.message)
    }
}

export const getHistoryByDeviveId = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;
        const deviceId = req.body?.deviceId;
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const skip = (page - 1) * limit;

        const result = await RecordsModel.find({ userId: userId, tagId: tagId, deviceId: deviceId }).sort({ createdDate: -1 }).skip(skip).limit(limit);
        if (result.length < 0) {
            return response(res, 404, "data not found", false);
        }
        return response(res, 200, "data founded successfully", true, result)
    } catch (error) {
        return response(res, 500, "internal server error", false, error.message)
    }
}


export const generateReportForSingleInstrument = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;
        const deviceId = req.body?.deviceId;

        const latestCount=req.body.latestCount||20; // by this  limiting report generation for 20 latest records of that instrument for that user.
        const result = await RecordsModel.find({ userId: userId, tagId: tagId, deviceId: deviceId }).sort({ createdDate: -1 }).limit(latestCount);
        if (result.length < 0) {
            return response(res, 404, "data not found", false);
        }

        const doc = new PDFDocument();

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
    } catch (error) {
        console.error('Error generating PDF:', error);
        return response(res, 500, "internal server error", false, error.message)

    }
}


export const generateReportOfMultipleDevice = async (req, res) => {
    try {
        const userId = req.user?.userId; // from token
        const tagId = req.body?.tagId;

        const deviceIds = req.body.deviceIds;
        const latestCount = req.body?.latestCount || 20; // this is for  generating reports of some fixed no of documents for each instrument . since there will large records for each instrument so that coulbe time consuming and also not reasonable . But if  user want ot get reports of all then we will make that also

        let result = deviceIds.map(async (id) => {
            return await RecordsModel.find({ userId: userId, tagId: tagId, deviceId: id }).sort({ createdDate: -1 }).limit(latestCount);
        })

        result = await Promise.all(result);

      
        if (result.length < 0) {
            return response(res, 404, "data not found", false);
        }

        // console.log("result", result);
        let dataForReport=[];
        result.map((t:any)=>{
          dataForReport=[...dataForReport,{deviceName:"AnotherDevice"},...t];
        })

        const doc = new PDFDocument();

        // <----------- USING PDF KIT  STYLING---------->  //
        doc.fontSize(12);
        doc.font('Helvetica-Bold').text('Report', { align: 'center' }).font('Helvetica');

        let sNo=1; // for showing SNo for each records which are showing as doument in report 
        dataForReport.forEach((record, index) => {
            if(record.deviceName==="AnotherDevice"){
                doc.moveDown().text("BELOW REPORTS ARE OF ONE DEVICE").moveDown(0.5)
            }
            else{
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
    } catch (error) {
        console.error('Error generating PDF:', error);
        return response(res, 500, "internal server error", false, error.message)
    }
}