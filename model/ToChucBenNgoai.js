import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const ToChucBenNgoai = sequelize.define("ToChucBenNgoai",{
    matc: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    tentc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diachi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sdt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

},{
    timestamps: false,
    tableName: "ToChucBenNgoai",
});

await ToChucBenNgoai.sync();

export default ToChucBenNgoai;