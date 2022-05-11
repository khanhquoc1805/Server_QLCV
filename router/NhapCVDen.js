import express from "express";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import NhapCVden from "../model/NhapCVDen.js";

const DraftCVDen = express.Router();

DraftCVDen.post("/add", async function (req, res) {
    const {
        iddraft,
        maloai,
        sohieugoc,
        coquanbanhanh,
        ngaybanhanh,
        trichyeu,
        ngaycohieuluc,
        ngayhethieuluc,
        nguoiky,
        masocv,
        ngayden,
        dokhan,
        domat,
        malv,
        hanxuli,
        manv,
        madv,
    } = req.body;
    console.log(req.body);

    if (
        madv === "" &&
        maloai === "" &&
        sohieugoc === "" &&
        coquanbanhanh === "" &&
        ngaybanhanh !== null &&
        trichyeu === "" &&
        ngaycohieuluc !== null &&
        ngayhethieuluc !== null &&
        nguoiky === "" &&
        masocv === "" &&
        ngayden !== null &&
        dokhan === "" &&
        domat === "" &&
        malv === "" &&
        hanxuli !== null &&
        manv !== null &&
        req.files.dinhkem === null
    ) {
        res.send("khongthaydoi");
        return;
    }

    if (req.files !== null) {
        await req.files.dinhkem.mv(
            `${process.cwd()}/public/file/nhap/` + req.files.dinhkem.name
        );
        values.dinhkem =
            `${process.cwd()}/public/file/nhap/` + req.files.dinhkem.name;
    }

    if (iddraft === "") {
        const values = {};
        // values.ngaybanhanh = ngaybanhanh;
        // values.ngaycohieuluc = ngaycohieuluc;
        // values.ngayhethieuluc = ngayhethieuluc;
        // values.ngayden = ngayden;
        // values.hanxuli = hanxuli;
        //console.log("da vao");

        if (maloai !== "") {
            values.maloai = maloai;
        }
        if (malv !== "") {
            values.malv = malv;
        }
        if (madv !== "") {
            values.madv = madv;
        }
        if (masocv !== "") {
            values.masocv = masocv;
        }

        const hanxuliInsert = new Date(hanxuli);
        hanxuliInsert.setDate(hanxuliInsert.getDate() + 1);

        const draftRecord = await NhapCVden.create({
            maloai: values.maloai,
            sohieugoc,
            coquanbanhanh,
            ngaybanhanh,
            trichyeu,
            ngaycohieuluc,
            ngayhethieuluc,
            nguoiky,
            masocv: values.masocv,
            ngayden,
            dokhan,
            domat,
            malv: values.malv,
            hanxuli: hanxuliInsert,
            manv,
            madv: values.madv,
            dinhkem: values.dinhkem,
        });
        res.send({ status: "add" });
        return;
    }

    if (iddraft !== "") {
        const hanxuliInsert = new Date(hanxuli);
        hanxuliInsert.setDate(hanxuliInsert.getDate() + 1);

        const values = {};
        if (maloai !== "") {
            values.maloai = maloai;
        }
        if (malv !== "") {
            values.malv = malv;
        }
        if (madv !== "") {
            values.madv = madv;
        }
        if (masocv !== "") {
            values.masocv = masocv;
        }
        const update = await NhapCVden.update(
            {
                maloai: values.maloai,
                sohieugoc,
                coquanbanhanh,
                ngaybanhanh,
                trichyeu,
                ngaycohieuluc,
                ngayhethieuluc,
                nguoiky,
                masocv: values.masocv,
                ngayden,
                dokhan,
                domat,
                malv: values.malv,
                hanxuli: hanxuliInsert,
                madv: values.madv,
                dinhkem: values.dinhkem,
            },
            {
                where: {
                    iddraft: iddraft,
                },
            }
        );

        res.send({ status: "update" });
        return;
    }
});

DraftCVDen.get("/", async function (req, res) {
    const manv = req.query.manv;
    if (manv === null) {
        res.send({ status: "error" });
        return;
    }
    const data = await NhapCVden.findAll({
        where: {
            manv: manv,
        },
    });

    let result = [];
    for (const record of data) {
        const loaicv = {};
        if (record.getDataValue("maloai") !== null) {
            const loai = await LoaiCV.findOne({
                where: {
                    maloai: record.getDataValue("maloai"),
                },
            });
            loaicv.tenloai = loai.getDataValue("tenloai");
        } else {
            loaicv.tenloai = "";
        }

        const dv = {};
        if (record.getDataValue("madv") !== null) {
            const donvi = await DonVi.findOne({
                where: {
                    madv: record.getDataValue("madv"),
                },
            });
            dv.tendv = donvi.getDataValue("tendv");
        } else {
            dv.tendv = "";
        }

        const lv = {};
        if (record.getDataValue("malv") !== null) {
            const lvuc = await LinhVuc.findOne({
                where: {
                    malv: record.getDataValue("malv"),
                },
            });
            lv.tenlv = lvuc.getDataValue("tenlv");
        } else {
            lv.tenlv = "";
        }

        result.push({
            data: record,
            loaicv: loaicv.tenloai,
            donvi: dv.tendv,
            lv: lv.tenlv,
        });
    }
    res.send(result);
});

DraftCVDen.get("/:iddraft", async function (req, res) {
    const iddraft = req.params.iddraft;
    if (!iddraft) {
        res.send({ status: "error" });
        return;
    }
    const data = await NhapCVden.findOne({
        where: {
            iddraft: iddraft,
        },
    });

    res.send(data);
});

DraftCVDen.post("/delete/:iddraft", async function (req, res) {
    const iddraft = req.params.iddraft;
    if (!iddraft) {
        res.send({ status: "error" });
        return;
    }

    const result = await NhapCVden.destroy({
        where: {
            iddraft: iddraft,
        },
    });
    if (result === 1) {
        res.send({ status: "successfully" });
    } else {
        res.send({ status: "error" });
    }
});

export default DraftCVDen;
