import 'dotenv/config'
import express  from "express"
import cors  from "cors"
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import catchErrors from './utils/catchErrors';
import { OK } from './constants/http';
import authRoutes from './routes/auth.route';

const app = express();

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:APP_ORIGIN,
    credentials:true
}));

app.use(cookieParser());


//Routes
app.get('/health', catchErrors(
    async(req, res, next) => {
        return res.status(OK).json({message:"Hello"})
    })
)

app.use('/auth', authRoutes);

//Global Error Handler
app.use(errorHandler);

//App Listen
app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    await connectToDatabase();
})