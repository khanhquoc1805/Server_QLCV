import { DataTypes } from "sequelize";
import CVDi from "./CVDi.js";
import sequelize from "./db.js";
import NhanVien from "./NhanVien.js";

const XuLyCVDi = sequelize.define(
    "XuLyCVDi",
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
        mavbdi: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: CVDi,
                key: "mavbdi",
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
        },
    },
    {
        timestamps: false,
        tableName: "XuLyCVDi",
    }
);



await XuLyCVDi.sync();

export default XuLyCVDi;
