import mongoose, { Document } from "mongoose";

export interface Records extends Document {
    userId: string;
    tagId: string;
    deviceId: string;
    deviceName:string;
    deviceModdle:string;
    reading: object;
    createdDate: Date;
}

const recordsSchema = new mongoose.Schema<Records>({
    userId: { type: String, required: true }, // get from token
    tagId: { type: String, required: true }, // it should come from  frontend
    deviceId: { type: String, required: true },
    deviceName:{ type: String, required: true },
    deviceModdle:{ type: String, required: true },
    reading: { type:Object, required: true },
    createdDate: { type:Date, required: true , default:Date.now() },//should come from frontend
});

const RecordsModel = mongoose.model<Records>("Record", recordsSchema);

export default RecordsModel;
