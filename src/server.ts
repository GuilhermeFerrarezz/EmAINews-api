import express from 'express';
import type { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import db from './models/index.model.js';
dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res: Response) => res.status(200).json({ message: "API enabled" }));

(async () => {
    try {
        await db.sequelize.authenticate();
        await db.sequelize.sync();
        console.log("Database successfuly sync")
    } catch (error) {
        console.error("Failed to connect to database ", error)
    }
})()


const PORT: string | number = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
    
})
