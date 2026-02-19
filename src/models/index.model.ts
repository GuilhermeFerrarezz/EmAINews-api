import User from './user.Model.js';
import sequelize from "../config/database.js";


const db = {
    sequelize,
    User,
}
export default db