import { DataTypes } from "sequelize";
import BoPhan from "./BoPhan.js";
import sequelize from "./db.js";
import DonVi from "./DonVi.js";
import LinhVuc from "./LinhVuc.js";
import LoaiCV from "./LoaiCV.js";
import NhanVien from "./NhanVien.js";
import SoCV from "./SoCV.js";
import ToChucBenNgoai from "./ToChucBenNgoai.js";
import TT_BoSung from "./TT_BoSung.js";

const CVDen = sequelize.define(
    "CVDen",
    {
        macvden: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
        },
        tencvden: {
            type: DataTypes.STRING,
        },
        ngaybanhanh: {
            type: DataTypes.DATE,
        },
        ngaycvden: {
            type: DataTypes.DATE,
        },
        ngayvaoso: {
            type: DataTypes.DATE,
        },
        ngaycohieuluc: {
            type: DataTypes.DATE,
        },
        ngayhethieuluc: {
            type: DataTypes.DATE,
        },
        nguoiky: {
            type: DataTypes.STRING,
        },
        xuly: {
            type: DataTypes.STRING,
        },
        hanxuli: {
            type: DataTypes.STRING,
        },
        coquanbanhanh: {
            type: DataTypes.STRING,
        },
        noinhan: {
            type: DataTypes.STRING,
        },
        sohieugoc: {
            type: DataTypes.STRING,
        },
        soden: {
            type: DataTypes.INTEGER,
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
        tableName: "CVDen",
    }
);

CVDen.belongsTo(DonVi, {
    foreignKey: "madv",
});
CVDen.belongsTo(LinhVuc, {
    foreignKey: "malv",
});

CVDen.belongsTo(LoaiCV, {
    foreignKey: "maloai",
});
CVDen.belongsTo(TT_BoSung, {
    foreignKey: "matt",
});
CVDen.belongsTo(SoCV, {
    foreignKey: "masocv",
});

await CVDen.sync();

export default CVDen;
