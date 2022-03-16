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

const cvden = express.Router();

cvden.get("", async function (req, res) {
    //console.log("asj")
    const { limit, page, status, textSearch } = req.query;
    let data = [];

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
    });
    if (status) {
        const statusList = status.split(",");
        temp = temp.filter((cvden) => {
            return statusList.includes(cvden.getDataValue("xuly"));
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
    const sotrang = req.body.sotrang;
    const dinhkem = req.files?.dinhkem;
    const masocv = req.body.masocv;
    const soden = req.body.soden;
    const ngaycvden = req.body.ngayden;
    const dokhan = req.body.dokhan;
    const domat = req.body.domat;
    const malv = req.body.malv;
    const hanxuli = req.body.hanxuli;
    const noinhan = req.body.noinhan;
    console.log(req.body);
    console.log(req.files?.dinhkem);

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
        !sotrang ||
        !dinhkem ||
        !masocv ||
        !soden ||
        !ngaycvden ||
        !dokhan ||
        !domat ||
        !malv ||
        !hanxuli
    ) {
        res.send({ status: "failed" });
        return;
    }
    dinhkem.mv("./public/file/cvden/" + dinhkem.name);
    const url = await uploadToCloudinary("./public/file/cvden/" + dinhkem.name);
    fs.unlink("./public/file/cvden/" + dinhkem.name, (err) => {
        if (err) {
            throw err;
        }
    });
    const ngaybanhanhInsert = new Date(ngaybanhanh);
    const ngaycohieulucInsert = new Date(ngaycohieuluc);
    const ngayhethieulucInsert = new Date(ngaycohieuluc);
    const hanxuliInsert = new Date(hanxuli);
    const ngayvaoso = new Date();
    hanxuliInsert.setDate(hanxuliInsert.getDate() + 1); // do nhan tu client kieu ngay nen khoi tao lai bi lui 1 ngay

    const tt_bosung = await TT_BoSung.create({
        sotrang,
        dinhkem: url.secure_url,
        dokhan,
        domat,
    });

    const saveCVDen = await CVDen.create({
        madv,
        maloai,
        sohieugoc,
        coquanbanhanh,
        ngaybanhanh,
        tencvden,
        ngaycohieuluc,
        ngayhethieuluc,
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
export default cvden;
