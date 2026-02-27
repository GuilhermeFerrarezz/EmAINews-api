import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.model.js';
import { JWT_SECRET } from '../middlewares/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize'; 
import type { Request, Response } from 'express'
const RefreshToken = db.RefreshToken
const User = db.User
interface IUser {
    id: string | number;
    name: string;
    email: string;
    password?: string;
    avatar?: string | null;
    googleId?: string | null
}
const createRefreshToken = async (user: IUser) => {
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + 604800);
        const token = uuidv4();
        const refreshToken = await RefreshToken.create({
            token: token,
            userId: user.id,
            expiresAt: expiresAt.getTime()
        } as any) ;
        return refreshToken.token;
}
export default {
   async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Incomplete data" })
            }
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: "E-mail already in database" })
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Error while adding user',
                error: error.message || error
            });
            
        }
    },
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body as { email?: string, password?: string }
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and passwords are required' });
            }
            const user = await User.findOne({ where: { email } }) as IUser | null;
            if (!user || !user.password) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            await RefreshToken.destroy({
                where: {
                    userId: user.id,
                    expiresAt: {
                        [Op.lt]: new Date().getTime()
                    }
                } as any
            });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const token = jwt.sign(
                { user: JSON.stringify(payload) },
                JWT_SECRET,
                { expiresIn: '10m', }
            )
            console.log('login')
            const refreshToken = await createRefreshToken(user)
            
            return res.status(200).json({ token,
                user: payload,
                refreshToken: refreshToken })

        } catch (error) {
            return res.status(500).json({ message: "Login error, error" })
        }
    }
    









}