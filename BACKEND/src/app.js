import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors'
import dotenv from 'dotenv'
import router from "./router/User.router.js";
import fileUpload from 'express-fileupload';


let app = express();
dotenv.config()


app.use(cors({
    origin:process.env.ORIGIN_URI,
    credentials:true
}))
app.use(urlencoded({extended:true,limit:"20kb"}))
app.use(json({limit:'20kb'}))
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }));
app.use("/api/v1",router)



export {app}