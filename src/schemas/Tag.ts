import mongoose, { Document } from "mongoose";

export interface Tags extends Document {
    userId: string;
    firstName: string;
    lastName:string;
}

const recordsSchema = new mongoose.Schema<Tags>({
    userId: { type: String, required:true }, // get from token
    firstName: { type: String, required: true }, // it should come from  frontend
    lastName:{ type: String, required: true },
});

const TagModel = mongoose.model<Tags>("Tag", recordsSchema);

export default TagModel;
