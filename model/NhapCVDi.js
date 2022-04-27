import { DataTypes } from "sequelize";
import sequelize from "./db.js";
import DonVi from "./DonVi.js";
import LinhVuc from "./LinhVuc.js";
import LoaiCV from "./LoaiCV.js";
import NhanVien from "./NhanVien.js";

const NhapCVdi = sequelize.define(
    "NhapCVdi",
    {
        iddraft: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trichyeu: {
            type: DataTypes.STRING,
        },
        ngayravbdi: {
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
    },
    {
        tableName: "NhapCVdi",
        timestamps: false,
    }
);

await NhapCVdi.sync();

export default NhapCVdi;
