import { Sequelize } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv"; 

dotenv.config();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {

    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false, 
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false 
            }
        }
    });
} else {
    console.log("Rodando localmente com SQLite...");
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: path.join(__dirname, "../database/database.sqlite"),
        logging: false
    });
}

export default sequelize;