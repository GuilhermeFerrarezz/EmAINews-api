import { DataTypes, Model, } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize"
import sequelize from "../config/database.js";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare googleId: CreationOptional<string | null>;
    declare name: string;
    declare email: string;
    declare password: CreationOptional<string | null>;
    declare avatar: CreationOptional<string | null>;
}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User'
});

export default User;