import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env";

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB is connected");
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}