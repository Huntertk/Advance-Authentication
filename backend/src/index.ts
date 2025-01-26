import 'dotenv/config'
import express  from "express"
import connectToDatabase from "./config/db";
import { NODE_ENV, PORT } from './constants/env';

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({message:"Hello"})
})

app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    await connectToDatabase();

})