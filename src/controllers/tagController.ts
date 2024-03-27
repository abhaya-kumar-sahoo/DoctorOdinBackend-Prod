import { Request, Response } from "express";
import RecordsModel from "../schemas/Records"
import { response } from "../response";
import dbConnect from "../db/dbconnect";
export const addTag = async (req, res) => {
    try {
        let userId = req.user?.userId;
        req.body.userId = userId;

        const dbconnect = await dbConnect("Tags");
        const data = await dbconnect.insertOne(req.body);
        return response(res, 201, "tag added successfully", true);
    } catch (error) {
        return response(res, 500, "internal server error ", false, error.message);
    }
}

