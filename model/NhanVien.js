import { DataTypes } from "sequelize";
import BoPhan from "./BoPhan.js";
import sequelize from "./db.js";
import DonVi from "./DonVi.js";

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
        email: {
            type: DataTypes.STRING,
        },
        mabp: {
            type: DataTypes.STRING,
            references: {
                model: BoPhan,
                key: "mabp",
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
        tableName: "NhanVien",
        timestamps: false,
    }
);
NhanVien.belongsTo(DonVi, {
    foreignKey: "madv",
});
NhanVien.belongsTo(BoPhan, {
    foreignKey: "mabp",
});

await NhanVien.sync();

export default NhanVien;
