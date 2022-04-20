import express from "express";
import BoPhan from "../model/BoPhan.js";
import DonVi from "../model/DonVi.js";
import NhanVien from "../model/NhanVien.js";
import bcrypt from "bcryptjs";
import { parseExcel } from "../utils/parseExcel.js";
import { autoPassword } from "../utils/autoPassword.js";
import { writeExcel } from "../utils/writeExcel.js";

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

user.post("/addmulti", async function (req, res) {
    const upload = req.files.upload;
    await upload.mv("./private/file/" + upload.name);

    const firstSheet = parseExcel(
        `${process.cwd()}/private/file/${upload.name}`
    )[0];

    const dataResult = [];
    for (const row of firstSheet.data) {
        console.log(row);
        const ngaysinhInsert = new Date(row.ngaysinh);
        ngaysinhInsert.setDate(ngaysinhInsert.getDate() + 1);

        const password = autoPassword();
        const salt = await bcrypt.genSalt(12);
        const hashpassword = await bcrypt.hash(password, salt);

        const nv = await NhanVien.findAll({});

        const index = nv.length - 1;
        const a = parseInt(nv[index].getDataValue("manv"), 5) + 1;
        const zero = "0".repeat(5 - (a + "").length); // lay so 0 tu so co truoc, vd 217 thi co 2 so 0 do chu so co 5 so

        const insertUser = await NhanVien.create({
            manv: `${zero}${a}`,
            tennv: row.tennv,
            ngaysinh: ngaysinhInsert,
            diachi: row.diachi,
            sdt: row.sdt,
            chucvu: row.chucvu,
            matkhau: hashpassword,
            quyen: "canbo",
            madv: row.madv,
            email: row.email,
        });
        const dv = await DonVi.findOne({
            where: {
                madv: insertUser.getDataValue("madv"),
            },
        });
        dataResult.push({
            taikhoan: insertUser.getDataValue("manv"),
            matkhau: password,
            tennv: insertUser.getDataValue("tennv"),
            email: insertUser.getDataValue("email"),
            donvi: dv.getDataValue("tendv"),
        });
        writeExcel(dataResult);
    }
    setTimeout(() => {
        res.sendFile(`${process.cwd()}/private/file/result.xlsx`);
    }, 100);

    // console.log();
});

export default user;
