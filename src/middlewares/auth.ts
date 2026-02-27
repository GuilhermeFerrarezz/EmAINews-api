import jsonwebtoken from "jsonwebtoken"
import type { Application, Request, Response, NextFunction } from 'express'
import dotenv from "dotenv"

dotenv.config()

export const JWT_SECRET: string = process.env.JWT_SECRET as string

export function tokenValidated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' })
    }

    try {
        const payload = jsonwebtoken.verify(token, JWT_SECRET) as any
        req.headers.user = payload.user;
        return next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({message: 'Invalid Token'})
    }

}