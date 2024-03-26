
import { Response } from "express";

export const response = (res: Response, status = 200, message = 'Success', success = true, data:any = {}) => {
    return res.status(status).json({
        success: success,
        message: message,
        data: data
    });
};


