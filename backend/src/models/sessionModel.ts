import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document{
    userId:mongoose.Types.ObjectId;
    userAgent?:string;
    createdAt:Date;
    expiresAt:Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true,
    },
    userAgent:{
        type:String,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    expiresAt:{
        type:Date,
        required:true,
        default:thirtyDaysFromNow
    }
})

const SessionModel = mongoose.model('Session', sessionSchema);
export default SessionModel;