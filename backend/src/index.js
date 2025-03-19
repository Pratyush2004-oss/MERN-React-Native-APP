import express from "express";
import dotenv from "dotenv";
import cors from 'cors';

import { connectToDb } from "./config/db.js";
import job from "./config/cron.js";


// Importing routes
import authRouter from './routes/auth.routes.js';
import bookRouter from './routes/books.route.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());    // Middleware to parse json data

app.use(cors());
job.start();

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);


// error handler routes
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === 'production' ? "Internal Server Error" : "Internal Server Error : " + err.message })
})
app.listen(PORT, () => {
    connectToDb();
    console.log(`Server running on port ${PORT}`);
})