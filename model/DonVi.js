import sequelize from "./db.js";
import { DataTypes } from "sequelize";

const DonVi = sequelize.define(
    "donvi",
    {
        madv: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tendv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "DonVi",
    }
);

await DonVi.sync();

export default DonVi;
