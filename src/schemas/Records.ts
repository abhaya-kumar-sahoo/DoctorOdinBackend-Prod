import mongoose, { Document } from "mongoose";

export interface Records extends Document {
 userId:string;
 tagId:string;
 deviceId:string;
 reading:string;
 date:string;
}

const recordsSchema = new mongoose.Schema<Records>({
 userId:{type:String,required:true}, // get from token
 tagId:{type:String,required:true}, // it should come from  frontend
 deviceId:{type:String,required:true},

});

const RecordsModel = mongoose.model<Records>("Record", recordsSchema);

export default RecordsModel;
