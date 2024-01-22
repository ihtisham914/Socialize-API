import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRouter from './Routes/AuthRoute.js'


dotenv.config()

const app = express();

// Middlewares
app.use(bodyParser.json({limit: '30mb', extented: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extented: true}));


// Connecting to Mongo and server
mongoose.connect(process.env.MONGO_DB).then(()=>{
    app.listen(8000, ()=> console.log("Database connected, Server Listening..."))
}).catch((error)=> console.log(error))


// Routes
app.use('/auth', AuthRouter);