import express from "express";
import BoPhan from "../model/BoPhan.js";
import DonVi from "../model/DonVi.js";
import NhanVien from "../model/NhanVien.js";
import bcrypt from "bcryptjs";

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

user.post("/add", async function (req, res) {
    const { manv, tennv, ngaysinh, diachi, sdt, chucvu, matkhau, quyen, madv } =
        req.body;

    if (
        manv == null ||
        tennv == null ||
        ngaysinh == null ||
        diachi == null ||
        sdt == null ||
        chucvu == null ||
        matkhau == null ||
        quyen == null ||
        madv == null
    ) {
        res.send({ status: "failed", massage: "" });
        return;
    }

    const user = await NhanVien.findOne({
        where: {
            manv: manv,
        },
    });

    if (user) {
        res.send({ status: "failed", massage: "Mã người dùng đã tồn tại!" });
        return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashpassword = await bcrypt.hash(matkhau, salt);
    console.log(ngaysinh);
    const ngaysinhInsert = new Date(ngaysinh);
    ngaysinhInsert.setDate(ngaysinhInsert.getDate() + 1);
    const insertUser = await NhanVien.create({
        manv: manv,
        tennv: tennv,
        ngaysinh: ngaysinhInsert,
        diachi: diachi,
        sdt: sdt,
        chucvu: chucvu,
        matkhau: hashpassword,
        quyen: quyen,
        madv: madv,
    });
    res.send({
        status: "successfully",
        massage: "Thêm người dùng thành công!",
    });
});

export default user;
