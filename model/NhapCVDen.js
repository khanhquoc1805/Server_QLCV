import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import DonVi from "./DonVi.js";
import LinhVuc from "./LinhVuc.js";
import LoaiCV from "./LoaiCV.js";
import NhanVien from "./NhanVien.js";
import SoCV from "./SoCV.js";

const NhapCVden = sequelize.define(
    "NhapCVden",
    {
        iddraft: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trichyeu: {
            type: DataTypes.STRING,
        },
        coquanbanhanh: {
            type: DataTypes.STRING,
        },
        ngaybanhanh: {
            type: DataTypes.DATE,
        },
        ngaycohieuluc: {
            type: DataTypes.DATE,
        },
        ngayhethieuluc: {
            type: DataTypes.DATE,
        },
        ngayden: {
            type: DataTypes.DATE,
        },
        hanxuli: {
            type: DataTypes.DATE,
        },
        dokhan: {
            type: DataTypes.STRING,
        },
        domat: {
            type: DataTypes.STRING,
        },
        dinhkem: {
            type: DataTypes.STRING,
        },
        sohieugoc: {
            type: DataTypes.STRING,
        },
        nguoiky: { type: DataTypes.STRING },

        maloai: {
            type: DataTypes.INTEGER,
            references: {
                model: LoaiCV,
                key: "maloai",
            },
        },
        malv: {
            type: DataTypes.INTEGER,
            references: {
                model: LinhVuc,
                key: "malv",
            },
        },
        madv: {
            type: DataTypes.INTEGER,
            references: {
                model: DonVi,
                key: "madv",
            },
        },
        manv: {
            type: DataTypes.STRING,
            references: {
                model: NhanVien,
                key: "manv",
            },
        },
        masocv: {
            type: DataTypes.STRING,
            references: {
                model: SoCV,
                key: "masocv",
            },
        },
    },
    {
        tableName: "NhapCVden",
        timestamps: false,
    }
);

await NhapCVden.sync();

export default NhapCVden;
