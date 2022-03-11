import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import DonVi from "./DonVi.js";

const SoCV = sequelize.define(
    "SoCV",
    {
        masocv: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        tensocv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nhomsocv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        madv: {
            type: DataTypes.INTEGER,
            references: {
                model: DonVi,
                key: "madv",
            },
        },
    },
    {
        timestamps: false,
        tableName: "SoCV",
    }
);

SoCV.belongsTo(DonVi, {
    foreignKey: "madv"
})

await SoCV.sync();

export default SoCV;
