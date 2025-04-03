import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors';

import authRoute from './routes/auth.route.js';
import itemRoute from './routes/item.route.js';
import logRoute from './routes/log.route.js';
import {connectDB} from './lib/db.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials : true,
}))

app.use('/api/auth', authRoute);
app.use('/api/items', itemRoute);
app.use('/api/log',logRoute);

app.listen(PORT, ()=>{
    console.log('Server started on http://localhost:'+PORT);
    connectDB()
})