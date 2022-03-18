import sequelize from "./db.js";
import { DataTypes } from "sequelize";
import BoPhan from "./BoPhan.js";
import NhanVien from "./NhanVien.js";
import LoaiCV from "./LoaiCV.js";
import TT_BoSung from "./TT_BoSung.js";
import ToChucBenNgoai from "./ToChucBenNgoai.js";
import LinhVuc from "./LinhVuc.js";
import DonVi from "./DonVi.js";
import SoCV from "./SoCV.js";

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
        nhanxuly: {
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
        tableName: "CVDi",
    }
);

DonVi.hasOne(CVDi, {
    foreignKey: "madv",
});
CVDi.belongsTo(DonVi, {
    foreignKey: "madv",
});
CVDi.belongsTo(LinhVuc, {
    foreignKey: "malv",
});

CVDi.belongsTo(LoaiCV, {
    foreignKey: "maloai",
});
CVDi.belongsTo(NhanVien, {
    foreignKey: "manv",
});

await CVDi.sync();

export default CVDi;
