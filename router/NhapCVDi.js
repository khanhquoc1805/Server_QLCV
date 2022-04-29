import express from "express";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import NhapCVdi from "../model/NhapCVDi.js";

const DraftCVDi = express.Router();

DraftCVDi.post("/add", async function (req, res) {
    const {
        iddraft,
        tenvbdi,
        ngayravbdi,
        dokhan,
        domat,
        maloai,
        malv,
        madv,
        manv,
    } = req.body;

    const dinhkem = req.files.dinhkem;

    if (manv === null) {
        res.send("error");
        return;
    }
    if (
        tenvbdi === "" &&
        dokhan === "" &&
        domat === "" &&
        maloai === "" &&
        malv === "" &&
        madv === "" &&
        dinhkem.size === 0 &&
        manv !== null &&
        ngayravbdi !== null
    ) {
        res.send("khongthaydoi");
        return;
    }

    if (iddraft === "") {
        const values = {};

        values.ngayravbdi = ngayravbdi;
        values.manv = manv;
        values.dinhkem = "";
        if (tenvbdi !== "") {
            values.tenvbdi = tenvbdi;
        }
        if (dokhan !== "") {
            values.dokhan = dokhan;
        }
        if (domat !== "") {
            values.domat = domat;
        }
        if (maloai !== "") {
            values.maloai = maloai;
        }
        if (malv !== "") {
            values.malv = malv;
        }
        if (madv !== "") {
            values.madv = madv;
        }
        if (dinhkem.size !== 0) {
            await dinhkem.mv(
                `${process.cwd()}/public/file/nhap/` + dinhkem.name
            );
            values.dinhkem =
                `${process.cwd()}/public/file/nhap/` + dinhkem.name;
        }
        const DraftRecord = await NhapCVdi.create({
            manv: values.manv,
            trichyeu: values.tenvbdi,
            dokhan: values.dokhan,
            domat: values.domat,
            ngayravbdi: values.ngayravbdi,
            maloai: values.maloai,
            malv: values.malv,
            madv: values.madv,
            dinhkem: values.dinhkem,
        });
        res.send({ status: "add" });
        return;
    }

    if (iddraft !== "") {
        const ngayravbdiInsert = new Date(ngayravbdi);
        ngayravbdiInsert.setDate(ngayravbdiInsert.getDate() + 1);

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
        const update = await NhapCVdi.update(
            {
                trichyeu: tenvbdi,
                ngayravbdi: ngayravbdiInsert,
                dokhan: dokhan,
                domat: domat,
                maloai: values.maloai,
                madv: values.madv,
                malv: values.malv,
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

    res.send("k chay vo daua");
});

DraftCVDi.get("/", async function (req, res) {
    const manv = req.query.manv;
    if (manv === null) {
        res.send({ status: "error" });
        return;
    }
    const data = await NhapCVdi.findAll({
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

DraftCVDi.get("/:iddraft", async function (req, res) {
    const iddraft = req.params.iddraft;
    if (!iddraft) {
        res.send({ status: "error" });
        return;
    }
    const data = await NhapCVdi.findOne({
        where: {
            iddraft: iddraft,
        },
    });

    res.send(data);
});

DraftCVDi.post("/delete/:iddraft", async function (req, res) {
    const iddraft = req.params.iddraft;
    if (!iddraft) {
        res.send({ status: "error" });
        return;
    }

    const result = await NhapCVdi.destroy({
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

export default DraftCVDi;
