import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import morgan from "morgan";

import errorMiddleware from "./middleware/errorMiddleware.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import userRoutes from "./routes/userRoutes.js";
const app=express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(morgan('dev'))

app.use(cors({
    arigin:[process.env.FRONTEND_URL],
    credentials:true
}))

app.use(cookieParser())

app.use('/ping',function(req,res){
    res.send('Pong')
})

app.use('/api/v1/user', userRoutes)

app.use('/api/v1/course', courseRoutes)

app.use('/api/v1/payments',paymentRoutes)



//routes of 3 module
app.all('*',(req,res)=>{
    res.status(400).send('OOPS! 404 page not found')//url not exist
});

app.use(errorMiddleware);

export default app;