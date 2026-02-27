import User from './user.Model.js';
import sequelize from "../config/database.js";
import type { Sequelize } from 'sequelize';
import RefreshToken from './RefreshToken.model.js';
interface Database {
    sequelize: Sequelize;
    User: typeof User; 
    RefreshToken: typeof RefreshToken
}
User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });
const db: Database= {
    sequelize,
    User,
    RefreshToken,
}
export default db