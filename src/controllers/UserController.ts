import { Request, Response } from "express";
import RecordsModel from "../schemas/Records"
import { response } from "../response";
import dbConnect from "@Odin/db/dbconnect";



// app.get('/api/download-pdf', (req, res) => {
//     try {
//       const DummyjsonData = {
//         employees: [
//           { id: 1, name: "John Doe", position: "Software Engineer", salary: 50000 },
//           { id: 2, name: "Jane Smith", position: "UI/UX Designer", salary: 60000 },
//           { id: 3, name: "Alice Johnson", position: "Project Manager", salary: 70000 }
//         ]
//       };
  
//       const doc = new PDFDocument();
  
//     // <----------- USING PDF KIT  STYLING---------->  //
//       doc.fontSize(12);
//       doc.font('Helvetica-Bold').text('Employee List', { align: 'center' }).font('Helvetica');
  
//       DummyjsonData.employees.forEach((employee, index) => {
//         doc.moveDown().text(Employee ${index + 1}:).moveDown(0.5)
//            .text(Name: ${employee.name})
//            .text(Position: ${employee.position})
//            .text(Salary: ${employee.salary});
//       });
  
      
//       res.setHeader('Content-Disposition', 'attachment; filename="data.pdf"');
//       res.setHeader('Content-Type', 'application/pdf');
  
//       doc.pipe(res);
  
     
//       doc.end();
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

export const addRecord = async (req: any, res: Response) => {
    try {
        //   console.log(req.user);
        let userId;
        if (req.user) {
            userId = req.user.userId;
        }

        req.body.userId = userId;

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
                    otherFields: { $last: "$$ROOT" } // Include other fields from the first document in each group
                }
            },
            {
                $replaceRoot: { newRoot: "$otherFields" } // Replace the root with the document containing all fields
            },
            {
                $skip:skip
            },
            {
                $limit:limit
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


