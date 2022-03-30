import express from "express";
import BoPhan from "../model/BoPhan.js";
import DonVi from "../model/DonVi.js";
import NhanVien from "../model/NhanVien.js";


var user = express.Router();

user.get("", async function (req, res) {
    const { limit, page, status, textSearch, madv } = req.query;
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    let data = [];
    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }

    let temp = await NhanVien.findAll({});

    let totalRows = temp.length;
    temp.splice(0, (pageInt - 1) * limitInt);
    data = temp.slice(0, limitInt);

    const result = [];

    for (const record of data) {
        const donvi = await DonVi.findOne({
            where: {
                madv: record.getDataValue("madv"),
            },
        });
        const bophan = await BoPhan.findOne({
            where: {
                mabp: record.getDataValue("mabp"),
            },
        });

        result.push({
            nv: record,
            donvi: donvi,
            bophan: bophan,
        });
    }

    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };

    res.send({ data: result, pagination });
});

export default user;
