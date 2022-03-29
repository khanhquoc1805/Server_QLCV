import { DataTypes } from "sequelize";
import CVDen from "./CVDen.js";
import sequelize from "./db.js";
import NhanVien from "./NhanVien.js";

const XuLy = sequelize.define(
    "XuLy",
    {
        manv: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            references: {
                model: NhanVien,
                key: "manv",
            },
        },
        macvden: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: CVDen,
                key: "macvden",
            },
        },
        trangthai: {
            type: DataTypes.STRING,
        },
        butphe: {
            type: DataTypes.STRING,
        },
        hanxuly: {
            type: DataTypes.DATE,
        },
        vaitro: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: false,
        tableName: "Xuly",
    }
);

await XuLy.sync();

export default XuLy;
