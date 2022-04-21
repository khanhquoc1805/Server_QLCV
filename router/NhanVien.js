import express from "express";
import NhanVien from "../model/NhanVien.js";

const nhanvien = express.Router();

nhanvien.post("/add", async function (req, res) {
    const body = req.body;
    const manv = body?.manv;
    const tennv = body?.tennv;
    const ngaysinh = body?.ngaysinh;
    const diachi = body?.diachi;
    const sdt = body?.sdt;
    const chucvu = body?.chucvu;
    const matkhau = body?.matkhau;
    const quyen = body?.quyen;
    const mabp = body?.mabp;

    if (
        manv == undefined ||
        tennv == undefined ||
        ngaysinh == undefined ||
        diachi == undefined ||
        sdt == undefined ||
        chucvu == undefined ||
        matkhau == undefined ||
        quyen == undefined ||
        mabp == undefined
    ) {
        // Invalid case
        res.send({ status: "failed", message: "Some fields are missing." });
        return;
    }

    const nv = await NhanVien.create({
        manv,
        tennv,
        ngaysinh,
        diachi,
        sdt,
        chucvu,
        matkhau,
        quyen,
        mabp,
    });

    if (nv == undefined) {
        res.send({ status: "failed", message: "Database error." });
        return;
    }
    res.send({ status: "success", message: "NhanVien has been created." });
});

nhanvien.post("", async function (req, res) {
    const nv = await NhanVien.findAll({
        attributes: ["manv", "tennv"],
    });

    res.send(nv);
});

nhanvien.get("/thongtin/:manv", async function (req, res) {
    const manv = req.params.manv;
    const nv = await NhanVien.findOne({
        attributes: ["manv", "tennv"],
        where: {
            manv: manv,
        },
    });
    res.send(nv)
    console.log(nv);
});

nhanvien.get("/:madv", async function (req, res) {
    const madv = req.params.madv;
    const data = await NhanVien.findAll({
        where: {
            madv: madv,
        },
        attributes: ["manv", "tennv"],
    });
    res.send(data);
});

export default nhanvien;
