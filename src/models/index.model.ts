import User from './user.Model.js';
import sequelize from "../config/database.js";
import type { Sequelize } from 'sequelize';
interface Database {
    sequelize: Sequelize;
    User: typeof User; 
}

const db: Database= {
    sequelize,
    User,
}
export default db