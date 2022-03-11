import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const LoaiCV = sequelize.define("LoaiCV",{
    maloai : {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    tenloai: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    
    timestamps: false,
    tableName: "LoaiCV",
})

await LoaiCV.sync();

export default LoaiCV;
