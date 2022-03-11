import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const LinhVuc = sequelize.define(
    "LinhVuc",
    {
        malv: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        tenlv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "LinhVuc",
    }
);
await LinhVuc.sync();
export default LinhVuc;