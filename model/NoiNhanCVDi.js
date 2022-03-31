import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import CVDi from "./CVDi.js";
import DonVi from "./DonVi.js";

const NoiNhanCVDi = sequelize.define(
    "NoiNhanCVDi",
    {
        mavbdi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: CVDi,
                key: "mavbdi",
            },
        },
        madv: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: DonVi,
                key: "madv",
            },
        },
        ghichu: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        tableName: "NoiNhanCVDi",
    }
);



await NoiNhanCVDi.sync();

export default NoiNhanCVDi;
