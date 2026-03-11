import db from '../models/index.model.js';
import type { Request, Response } from 'express'
import type { Category } from '../models/userPreferences.Model.js'

const UserPreference = db.UserPreference;

interface AuthRequest extends Request {
    user?: {
        id: string
    }
}

export default {

    async create(req: AuthRequest, res: Response) {
        try {

            const user_id = req.user?.id

            const { category, locale, language } = req.body as {
                category?: Category
                locale?: string
                language?: string
            }

            if (!user_id) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            if (!category || !locale || !language) {
                return res.status(400).json({ message: "Incomplete data" })
            }

            const categoryUserExists = await UserPreference.findOne({
                where: {
                    user_id,
                    category
                }
            })

            if (categoryUserExists) {
                return res.status(400).json({
                    message: "Category already added"
                })
            }

            const userPreference = await UserPreference.create({
                user_id,
                category,
                locale,
                language
            })

            return res.status(201).json(userPreference)

        } catch (error: any) {

            return res.status(500).json({
                message: 'Error while adding preferences',
                error: error.message || error
            })
        }
    },

    async listAll(req: AuthRequest, res: Response) {

        try {

            const user_id = req.user?.id

            const preferences = await UserPreference.findAll({
                where: { user_id }
            })

            return res.status(200).json(preferences)

        } catch (error: any) {

            return res.status(500).json({
                message: 'Error while listing preferences',
                error: error.message || error
            })
        }

    },

    async remove(req: AuthRequest, res: Response) {

        try {

            const user_id = req.user?.id
            const { category } = req.body as { category?: Category }

            if (!category) {
                return res.status(400).json({
                    message: "Nothing selected"
                })
            }

            const deleted = await UserPreference.destroy({
                where: {
                    user_id,
                    category
                }
            })

            return res.status(200).json({
                message: "Preference removed",
                deleted
            })

        } catch (error: any) {

            return res.status(500).json({
                message: 'Error while removing preference',
                error: error.message || error
            })

        }

    },

    async update(req: AuthRequest, res: Response) {

    try {

        const user_id = req.user?.id

        const { category } = req.params as { category?: Category }

        const { locale, language } = req.body as {
            locale?: string
            language?: string
        }

        if (!user_id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (!category) {
            return res.status(400).json({
                message: "Category not provided"
            })
        }

        const preference = await UserPreference.findOne({
            where: {
                user_id,
                category
            }
        })

        if (!preference) {
            return res.status(404).json({
                message: "Preference not found"
            })
        }

        await preference.update({
            locale: locale ?? preference.locale,
            language: language ?? preference.language
        })

        return res.status(200).json({
            message: "Preference updated",
            preference
        })

    } catch (error: any) {

        return res.status(500).json({
            message: "Error while updating preference",
            error: error.message || error
        })

    }

}

}