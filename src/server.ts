import express from 'express';
import type { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res: Response) => res.status(200).json({ message: "API enabled" }));

const PORT: string | number = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT)
    
})
