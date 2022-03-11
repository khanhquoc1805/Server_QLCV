import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const BoPhan = sequelize.define(
    "BoPhan",
    {
        mabp: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        tenbp: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "BoPhan",
    }
);
await BoPhan.sync();
export default BoPhan;
