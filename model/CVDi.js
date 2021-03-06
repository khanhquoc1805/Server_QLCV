import { DataTypes } from "sequelize";
import BoPhan from "./BoPhan.js";
import sequelize from "./db.js";
import LinhVuc from "./LinhVuc.js";
import LoaiCV from "./LoaiCV.js";
import NhanVien from "./NhanVien.js";
import SoCV from "./SoCV.js";
import ToChucBenNgoai from "./ToChucBenNgoai.js";
import TT_BoSung from "./TT_BoSung.js";

const CVDi = sequelize.define(
    "CVDi",
    {
        mavbdi: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        tenvbdi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ngayravbdi: {
            type: DataTypes.DATE,
        },
        ngayvbdi: {
            type: DataTypes.DATE,
        },
        ngayvaoso: {
            type: DataTypes.DATE,
        },
        nguoiky: {
            type: DataTypes.STRING,
        },
        ghichu: {
            type: DataTypes.STRING,
        },
        ttxuly: {
            type: DataTypes.STRING,
        },
        mabp: {
            type: DataTypes.STRING,
            references: {
                model: BoPhan,
                key: "mabp",
            },
        },
        masocv: {
            type: DataTypes.STRING,
            references: {
                model: SoCV,
                key: "masocv",
            },
        },
        maloai: {
            type: DataTypes.INTEGER,
            references: {
                model: LoaiCV,
                key: "maloai",
            },
        },
        matt: {
            type: DataTypes.INTEGER,
            references: {
                model: TT_BoSung,
                key: "matt",
            },
        },
        matc: {
            type: DataTypes.STRING,
            references: {
                model: ToChucBenNgoai,
                key: "matc",
            },
        },
        malv: {
            type: DataTypes.INTEGER,
            references: {
                model: LinhVuc,
                key: "malv",
            },
        },
    },
    {
        timestamps: false,
        tableName: "CVDi",
    }
);

CVDi.belongsTo(LinhVuc, {
    foreignKey: "malv",
});

CVDi.belongsTo(LoaiCV, {
    foreignKey: "maloai",
});
CVDi.belongsTo(NhanVien, {
    foreignKey: "manv",
});
CVDi.belongsTo(TT_BoSung, {
    foreignKey: "matt",
});

await CVDi.sync();

export default CVDi;
