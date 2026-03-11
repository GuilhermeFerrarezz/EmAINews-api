import { DataTypes, Model, } from "sequelize";
import type {InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize"
import sequelize from "../config/database.js";
import User from './user.Model.js';


type Category = "general"| "science"| "sports"| "business"| "health"| "entertainment"| "tech"| "politics"| "food"| "travel";

class UserPreference extends Model<InferAttributes<UserPreference>, InferCreationAttributes<UserPreference>> {

    declare user_id: CreationOptional<string>;
    declare category: CreationOptional<Category>
    declare locale: CreationOptional<string>;
    declare language: CreationOptional<string>;
    declare source: CreationOptional<string | null>;
}

UserPreference.init({

  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: User,
      key: "id"
    }
    
  },

  category: {
    type: DataTypes.STRING,
    primaryKey: true
  },

  source: {
    type: DataTypes.STRING,
    allowNull: true
  },

  locale: {
    type: DataTypes.STRING,
    defaultValue: "us"
  },

  language: {
    type: DataTypes.STRING,
    defaultValue: "en"
  }

}, {
  sequelize,
  modelName: "UserPreference",
  tableName: "user_preferences"
});

export default UserPreference;
