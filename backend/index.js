import express from 'express';
import { connectDb } from './db/connectDb.js';
import 'dotenv/config';

const app = express();

app.get("/", (req, res, next) => {
    res.status(200).json({message:"Message"})
})

app.listen(3000, () => {
    connectDb();
    console.log("Server is running PORT : 3000");
    
})
