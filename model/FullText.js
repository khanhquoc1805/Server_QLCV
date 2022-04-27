import sequelize from "./db.js";
import { DataTypes } from "sequelize";

const FullText = sequelize.define(
    "myfulltext",
    {
        code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        noidung: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "MyFullText",
    },
    {
        indexes: [
            {
                // type: "FULLTEXT",
                using: 'FULLTEXT',
                name: "text_idx",
                unique: true,
                // fields: ["text", "content", "noidung", "title"],
                fields: ["text"],
            },
        ],
    }
);

await FullText.sync();

export default FullText;
