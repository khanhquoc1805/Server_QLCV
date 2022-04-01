import express from "express";
import CVDi from "../model/CVDi.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import TT_BoSung from "../model/TT_BoSung.js";
import removeVietnameseTones from "../utils/removeVNTones.js";
import cloudinary from "cloudinary";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import NhanVien from "../model/NhanVien.js";
import NoiNhanCVDi from "../model/NoiNhanCVDi.js";
import XulyCVDi from "../model/XuLyCVDi.js";
import XuLyCVDi from "../model/XuLyCVDi.js";

const cvdi = express.Router();

cvdi.get("", async function (req, res) {
    const { limit, page, status, textSearch, madv } = req.query;
    let data = [];

    console.log(madv);

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    if (!limit || !page || !madv) {
        res.send({ status: "failed" });
        return;
    }

    // get all cong van di
    let temp = await CVDi.findAll({
        include: [
            {
                model: LinhVuc,
                required: true,
            },
            {
                model: LoaiCV,
                required: true,
            },
        ],
    });

    // status=daxuly,chuaxuly
    if (status) {
        const statusList = status.split(",");
        temp = temp.filter((cvdi) => {
            return statusList.includes(cvdi.getDataValue("ttxuly"));
        });
    }

    if (textSearch !== undefined) {
        temp = temp.filter((cvdi) => {
            return (
                removeVietnameseTones(cvdi.getDataValue("tenvbdi"))
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvdi.getDataValue("LinhVuc").getDataValue("tenlv")
                )
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvdi.getDataValue("LoaiCV").getDataValue("tenloai")
                )
                    .toLowerCase()
                    .includes(removeVietnameseTones(textSearch).toLowerCase())
            );
        });
    }

    let totalRows = temp.length;
    temp.splice(0, (pageInt - 1) * limitInt);
    data = temp.slice(0, limitInt);
    const result = [];
    for (const record of data) {
        const ttbosung = await TT_BoSung.findOne({
            where: {
                matt: record.getDataValue("matt"),
            },
        });
        const loaiCV = await LoaiCV.findOne({
            where: {
                maloai: record.getDataValue("maloai"),
            },
        });

        const linhVuc = await LinhVuc.findOne({
            where: {
                malv: record.getDataValue("malv"),
            },
        });
        const noinhan = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: record.getDataValue("mavbdi"),
                madv: madv,
                ghichu: "gui",
            },
        });
        let donvi;
        if (!noinhan) {
            donvi = { madv: 0, tendv: "" };
        } else {
            donvi = await DonVi.findOne({
                where: {
                    madv: noinhan.getDataValue("madv"),
                },
            });
        }

        result.push({
            cvdi: record,
            ttbosung: ttbosung,
            loaicv: loaiCV,
            donvi: donvi,
            linhvuc: linhVuc,
        });
    }
    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    res.send({ data: result, pagination });
});

cvdi.get("/:mavbdi", async function (req, res) {
    const mavbdi = req.params.mavbdi;
    if (mavbdi == null) {
        res.send({ status: "error" });
        return;
    }

    const data = await CVDi.findOne({
        where: {
            mavbdi: mavbdi,
        },
    });

    if (data) {
        const ttbosung = await TT_BoSung.findOne({
            where: {
                matt: data.getDataValue("matt"),
            },
        });
        const loaiCV = await LoaiCV.findOne({
            where: {
                maloai: data.getDataValue("maloai"),
            },
        });

        const linhVuc = await LinhVuc.findOne({
            where: {
                malv: data.getDataValue("malv"),
            },
        });
        const noinhan = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: data.getDataValue("mavbdi"),
                ghichu: "gui",
            },
        });

        const donvi = await DonVi.findOne({
            where: {
                madv: noinhan.getDataValue("madv"),
            },
        });

        res.send({
            cvdi: data,
            ttbosung: ttbosung,
            loaicv: loaiCV,
            donvi: donvi,
            linhvuc: linhVuc,
        });
    } else {
        res.send({ status: "failed" });
    }
});

cvdi.post("/add", async function (req, res) {
    const body = req.body;
    const dinhkem = req.files.dinhkem;
    const madv = body.madv;
    const maloai = body.maloai;
    const tenvbdi = body.tenvbdi;
    const ngayravbdi = body.ngayravbdi;
    const dokhan = body.dokhan;
    const domat = body.domat;
    const malv = body.malv;
    const sotrang = body.sotrang;
    const manv = body.manv;

    if (
        madv == null ||
        maloai == null ||
        tenvbdi == null ||
        ngayravbdi == null ||
        dinhkem == null ||
        dokhan == null ||
        domat == null ||
        malv == null ||
        sotrang == null ||
        manv == null
    ) {
        res.send({ status: "failed" });
        return;
    }

    dinhkem.mv("./public/file/cvdi/" + dinhkem.name);
    const url = await uploadToCloudinary("./public/file/cvdi/" + dinhkem.name);
    console.log(url);

    fs.unlink("./public/file/cvdi/" + dinhkem.name, (err) => {
        if (err) {
            throw err;
        }
    });

    const ngayravbdiInsert = new Date(body.ngayravbdi);
    ngayravbdiInsert.setDate(ngayravbdiInsert.getDate() + 1);
    const ngayvbdi = new Date();

    const tt_bosung = await TT_BoSung.create({
        sotrang,
        dinhkem: url.secure_url,
        dokhan,
        domat,
    });
    const savedCvdi = await CVDi.create({
        maloai,
        tenvbdi,
        ngayravbdi: ngayravbdiInsert,
        ngayvbdi: ngayvbdi,
        malv,
        matt: tt_bosung.getDataValue("matt"),
        ttxuly: "chuaxuly",
    });
    const noinhancvdi = NoiNhanCVDi.create({
        mavbdi: savedCvdi.getDataValue("mavbdi"),
        madv: madv,
        ghichu: "gui",
    });
    const insertNVDuThao = await XulyCVDi.create({
        manv: manv,
        mavbdi: savedCvdi.getDataValue("mavbdi"),
        vaitro: "duthao",
    });
    res.send({ status: "successfully" });
});

cvdi.post("/xulytrangthai/:mavbdi", async function (req, res) {
    const mavbdi = parseInt(req.params.mavbdi);

    if (Number.isNaN(mavbdi)) {
        res.send({ status: "failed" });
        return;
    }
    const cvdi = await CVDi.update(
        {
            ttxuly: "daduyet",
        },
        {
            where: {
                mavbdi: mavbdi,
            },
        }
    );
    if (cvdi <= 0) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully" });
});

cvdi.post("/chuyenxuly", async function (req, res) {
    const { nguoinhan, butphechuyen, hanxuly, mavbdi } = req.body;
    if (nguoinhan === null || mavbdi == null) {
        res.send({ status: "failed", massage: "lỗi chưa xác định" });
        return;
    }
    const hanxulyInsert = new Date(hanxuly);
    hanxulyInsert.setDate(hanxulyInsert.getDate() + 1);
    const insertXuLy = await XuLyCVDi.create({
        mavbdi: mavbdi,
        manv: nguoinhan,
        trangthai: "chuaxuly",
        butphe: butphechuyen,
        hanxuly: hanxulyInsert,
        vaitro: "xuly",
    });
    res.send({ status: "successfully", massage: "Chuyển xử lý thành công!" });
});

cvdi.post("/themvaoso/:mavbdi", async function (req, res) {
    const mavbdi = parseInt(req.params.mavbdi);
    const masocv = req.body.masocv;
    if (Number.isNaN(mavbdi) || !masocv) {
        res.send({ status: "failed" });
        return;
    }
    const update = await CVDi.update(
        {
            masocv: masocv,
            ttxuly: "davaoso",
        },
        {
            where: {
                mavbdi: mavbdi,
            },
        }
    );
    if (update <= 0) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully" });
});

export default cvdi;
