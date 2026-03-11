import User from './user.Model.js';
import sequelize from "../config/database.js";
import type { Sequelize } from 'sequelize';
import RefreshToken from './RefreshToken.model.js';
import UserPreference from './userPreferences.Model.js'
interface Database {
    sequelize: Sequelize;
    User: typeof User; 
    RefreshToken: typeof RefreshToken;
    UserPreference: typeof UserPreference
}

User.hasOne(RefreshToken, {
    foreignKey: 'userId',
    onDelete: "CASCADE"
});

RefreshToken.belongsTo(User,
    {
        foreignKey: "userId"      
    });

// Relação entre o User e o User Preferences

User.hasMany(UserPreference, {
  foreignKey: "user_id",
  as: "preferences",
  onDelete: "CASCADE"
});

UserPreference.belongsTo(User, {
  foreignKey: "user_id",
  as: "user"
});

const db: Database= {
    sequelize,
    User,
    RefreshToken,
    UserPreference
}
export default db