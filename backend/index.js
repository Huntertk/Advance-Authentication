import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDb } from './db/connectDb.js';
import express from 'express';

import authRoutes from './routes/authRoute.js'

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res, next) => {
    res.status(200).json({message:"Message"})
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    connectDb();
    console.log("Server is running PORT :",PORT);
    
})
