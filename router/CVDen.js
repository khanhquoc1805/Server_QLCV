import express from "express";
import CVDen from "../model/CVDen.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import SoCV from "../model/SoCV.js";
import TT_BoSung from "../model/TT_BoSung.js";
import cloudinary from "cloudinary";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import NhanVien from "../model/NhanVien.js";
import removeVietnameseTones from "../utils/removeVNTones.js";
import { createSoDen } from "../utils/createSoDen.js";
import { readContentPDF } from "../utils/readContentPdf.js";
import { RemoveDownLine } from "../utils/RemoveDownLine.js";
import XuLy from "../model/XuLy.js";

const cvden = express.Router();

cvden.get("", async function (req, res) {
    //console.log("asj")
    const { limit, page, status, textSearch, madv } = req.query;
    let data = [];
    //console.log(madv);
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);

    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }

    let temp = await CVDen.findAll({
        include: [
            {
                model: DonVi,
                required: true,
            },
            {
                model: LinhVuc,
                required: true,
            },
            {
                model: LoaiCV,
                required: true,
            },
            {
                model: TT_BoSung,
                required: true,
            },
        ],
        where: {
            madv: madv || 0,
        },
    });
    if (status) {
        const statusList = status.split(",");
        temp = temp.filter((cvden) => {
            return statusList.includes(cvden.getDataValue("xuly"));
        });
    }
    if (textSearch !== undefined) {
        temp = temp.filter((cvden) => {
            return (
                removeVietnameseTones(cvden.getDataValue("tencvden"))
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvden.getDataValue("LinhVuc").getDataValue("tenlv")
                )
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvden.getDataValue("LoaiCV").getDataValue("tenloai")
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
        const donVi = await DonVi.findOne({
            where: {
                madv: record.getDataValue("madv"),
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

        result.push({
            cvden: record,
            ttbosung: ttbosung,
            donvi: donVi,
            loaicv: loaiCV,
            linhvuc: linhVuc,
        });
    }

    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    res.send({ data: result, pagination });

    // if (limit !== undefined && page !== undefined) {
    //     const data = await CVDen.findAll({
    //         offset: (pageInt - 1) * limitInt,
    //         limit: limitInt,
    //     });
    //     const result = [];
    //     for (const record of data) {
    //         const ttbosung = await TT_BoSung.findOne({
    //             where: {
    //                 matt: record.getDataValue("matt"),
    //             },
    //         });
    //         result.push({ cvden: record, ttbosung: ttbosung });
    //     }
    //     res.send(result);
    // }
});

cvden.get("/:macvden", async function (req, res) {
    const macvden = req.params.macvden;
    if (macvden == null) {
        res.send({ status: "error" });
        return;
    }
    const data = await CVDen.findOne({
        where: {
            macvden: macvden,
        },
    });

    console.log(macvden);

    if (data) {
        const loaicv = await LoaiCV.findOne({
            where: {
                maloai: data.getDataValue("maloai"),
            },
        });
        const linhvuc = await LinhVuc.findOne({
            where: {
                malv: data.getDataValue("malv"),
            },
        });
        const ttbosung = await TT_BoSung.findOne({
            where: data.getDataValue("matt"),
        });
        const donvi = await DonVi.findOne({
            where: {
                madv: data.getDataValue("madv"),
            },
        });
        res.send({
            status: "successfully",
            cvden: data,
            loaicv: loaicv,
            linhvuc: linhvuc,
            ttbosung: ttbosung,
            donvi: donvi,
        });
    } else {
        res.send({ status: "failed" });
    }
});

cvden.post("/add", async function (req, res) {
    const madv = req.body.madv;
    const maloai = req.body.maloai;
    const sohieugoc = req.body.sohieugoc;
    const coquanbanhanh = req.body.coquanbanhanh;
    const ngaybanhanh = req.body.ngaybanhanh;
    const tencvden = req.body.trichyeu;
    const ngaycohieuluc = req.body.ngaycohieuluc;
    const ngayhethieuluc = req.body.ngayhethieuluc;
    const nguoiky = req.body.nguoiky;
    const dinhkem = req.files?.dinhkem;
    const masocv = req.body.masocv;
    const ngaycvden = req.body.ngayden;
    const dokhan = req.body.dokhan;
    const domat = req.body.domat;
    const malv = req.body.malv;
    const hanxuli = req.body.hanxuli;
    const noinhan = req.body.noinhan;
    // console.log(req.body);
    // console.log(req.files?.dinhkem);

    if (
        !madv ||
        !maloai ||
        !sohieugoc ||
        !coquanbanhanh ||
        !ngaybanhanh ||
        !tencvden ||
        !ngaycohieuluc ||
        !ngayhethieuluc ||
        !nguoiky ||
        !dinhkem ||
        !masocv ||
        !ngaycvden ||
        !dokhan ||
        !domat ||
        !malv ||
        !hanxuli
    ) {
        res.send({ status: "failed" });
        return;
    }
    await dinhkem.mv(`${process.cwd()}/public/file/cvden/` + dinhkem.name);

    const pdf = await readContentPDF(
        `${process.cwd()}/public/file/cvden/` + dinhkem.name
    );

    const url = await uploadToCloudinary(
        `${process.cwd()}/public/file/cvden/` + dinhkem.name
    );
    // fs.unlink(`${process.cwd()}/public/file/cvden/` + dinhkem.name, (err) => {
    //     if (err) {
    //         throw err;
    //     }
    // });

    const soden = await createSoDen(malv, madv);
    const ngaybanhanhInsert = new Date(ngaybanhanh);
    const ngaycohieulucInsert = new Date(ngaycohieuluc);
    const ngayhethieulucInsert = new Date(ngaycohieuluc);
    const hanxuliInsert = new Date(hanxuli);
    const ngayvaoso = new Date();
    hanxuliInsert.setDate(hanxuliInsert.getDate() + 1); // do nhan tu client kieu ngay nen khoi tao lai bi lui 1 ngay

    const tt_bosung = await TT_BoSung.create({
        sotrang: pdf.numpages,
        dinhkem: url.secure_url,
        dokhan,
        domat,
        noidung: RemoveDownLine(pdf.text),
    });

    const saveCVDen = await CVDen.create({
        madv,
        maloai,
        sohieugoc,
        coquanbanhanh,
        ngaybanhanh: ngaybanhanhInsert,
        tencvden,
        ngaycohieuluc: ngaycohieulucInsert,
        ngayhethieuluc: ngayhethieulucInsert,
        nguoiky,
        masocv,
        soden,
        ngaycvden,
        malv,
        hanxuli,
        noinhan,
        ngayvaoso,
        matt: tt_bosung.getDataValue("matt"),
        xuly: "chuaxuly",
    });
    res.send({ status: "successfully" });
});

cvden.post("/tiepnhanvanbancunghethong", async function (req, res) {
    const { macvden } = req.body;
    console.log(req.body);
    if (macvden == null) {
        res.send({ status: "failed", massage: "" });
        return;
    }
    const updateTT = await CVDen.update(
        {
            xuly: "chuaxuly",
        },
        {
            where: {
                macvden: macvden,
            },
        }
    );
    res.send({ status: "successfully", massage: "Tiếp nhận thành công" });
});

cvden.post("/delete/:macvden", async function (req, res) {
    const macvden = req.params.macvden;

    if (macvden === null) {
        res.send({ status: "error" });
        return;
    }

    const delXuLy = await XuLy.destroy({
        where: {
            macvden: macvden,
        },
    });

    const delCVden = await CVDen.destroy({
        where: {
            macvden: macvden,
        },
    });

    res.send({ status: "successfully" });
});

export default cvden;
