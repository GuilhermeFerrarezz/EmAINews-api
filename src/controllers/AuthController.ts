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
    },
    async refreshToken(req: Request, res: Response) {
        const { requestToken } = req.body as {requestToken?: string};
        if (!requestToken) {
            return res.status(403).json({ message: "Refresh Token is required" })
        }
        try {
            const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } }) as any;
            if (!refreshToken) {
                return res.status(403).json({ message: "Refresh token is not valid" })
            }
            if (RefreshToken.verifyExpiration(refreshToken)) {
                await RefreshToken.destroy({ where: { id: refreshToken.id } })
                return res.status(403).json({
                    message: "You session has expired. Try to login again"
                })
            }
            const user = await User.findByPk(refreshToken.userId) as IUser;

            await RefreshToken.destroy({ where: { id: refreshToken.id } });
            const newRefreshToken = await createRefreshToken(user);


            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            const newAccessToken = jwt.sign(
                { user: JSON.stringify(payload) },
                JWT_SECRET as string,
                { expiresIn: '10m', }
            );
            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })


        } catch (err: any) {
            return res.status(500).json({ message: err.message || "Internal server error" });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            console.log('logout')
            const { requestToken } = req.body as { requestToken?: string };
            console.log(requestToken)
            if (!requestToken) {
                return res.status(400).json({ message: "Refresh Token is required to logout" })
            }
            await RefreshToken.destroy({ where: { token: requestToken } });
            return res.status(200).json({ message: "Logout successful" })
        } catch (err: any) {
            console.error("Logou error:", err);
            return res.status(500).json({ message: err.message || "Internal server error" });
        }

    },









}