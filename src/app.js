import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());



//routes here
import userRouter from './routes/user.route.js';

//routes declaration
app.use("/api/v1/users",userRouter)
export{app};