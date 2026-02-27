import { DataTypes, Model, } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize"
import sequelize from "../config/database.js";

class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
    declare id: CreationOptional<string>
    declare token: string
    declare expiresAt: Date;
    public static verifyExpiration = (token: RefreshToken): boolean => {
    return token.expiresAt.getTime() < new Date().getTime();
}
}
RefreshToken.init({
   id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'RefreshToken'
});


export default RefreshToken;