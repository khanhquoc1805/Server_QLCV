import { DataTypes } from "sequelize";
import BoPhan from "./BoPhan.js";
import sequelize from "./db.js";

const NhanVien = sequelize.define(
    "NhanVien",
    {
        manv: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        tennv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ngaysinh: {
            type: DataTypes.DATE,
        },
        diachi: {
            type: DataTypes.STRING,
        },
        sdt: {
            type: DataTypes.STRING,
        },
        chucvu: {
            type: DataTypes.STRING,
        },
        matkhau: {
            type: DataTypes.STRING,
        },
        quyen: {
            type: DataTypes.STRING,
        },
        mabp: {
            type: DataTypes.STRING,
            references: {
                model: BoPhan,
                key: "mabp",
            },
        },
    },
    {
        tableName: "NhanVien",
        timestamps: false,
    }
);

await NhanVien.sync();

export default NhanVien;
