import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/db';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import catchAsync from './utils/catchErrors';
import authRoutes from './routes/authRoute';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:APP_ORIGIN,
    // methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true
}))
app.use(cookieParser());


app.get('/health', catchAsync(
    async(req, res, next) => {
        res.status(200).json({
            status:"health"
        })
    })
)

app.use('/auth', authRoutes)


app.use(errorHandler)

app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server is running on ${PORT} in ${NODE_ENV} mode`);
})