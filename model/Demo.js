import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import DonVi from "./DonVi.js";
import LoaiCV from "./LoaiCV.js";
import LinhVuc from "./LinhVuc.js";

const Demo = sequelize.define(
    "demo",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        malv: {
            type: DataTypes.INTEGER,
            references: {
                model: LinhVuc,
                key: "malv",
            },
        },
        trichyeu: {
            type: DataTypes.STRING,
        },
        coquanbanhanh: {
            type: DataTypes.STRING,
        },
        maloai: {
            type: DataTypes.INTEGER,
            references: {
                model: LoaiCV,
                key: "maloai",
            },
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
        tableName: "Demo",
    }
);

await Demo.sync();

export default Demo;
