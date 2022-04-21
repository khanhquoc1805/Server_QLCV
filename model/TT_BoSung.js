import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const TT_BoSung = sequelize.define(
    "TT_BoSung",
    {
        matt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sotrang: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dinhkem: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dokhan: {
            type: DataTypes.STRING,
        },
        domat: {
            type: DataTypes.STRING,
        },
        khac: {
            type: DataTypes.STRING,
        },
        noidung: {
            type: DataTypes.TEXT,
        },
    },
    {
        timestamps: false,
        tableName: "TT_BoSung",
    }
);

await TT_BoSung.sync();

export default TT_BoSung;
