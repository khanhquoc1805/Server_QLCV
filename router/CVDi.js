import express from "express";
import CVDi from "../model/CVDi.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import TT_BoSung from "../model/TT_BoSung.js";
import removeVietnameseTones from "../utils/removeVNTones.js";

const cvdi = express.Router();

cvdi.get("", async function (req, res) {
    const { limit, page, status, textSearch } = req.query;
    let data = [];

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }

    // get all cong van di
    let temp = await CVDi.findAll({
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
                    cvdi.getDataValue("donvi").getDataValue("tendv")
                )
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
            cvdi: record,
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

    if (
        madv == null ||
        maloai == null ||
        tenvbdi == null ||
        ngayravbdi == null ||
        dinhkem == null ||
        dokhan == null ||
        domat == null ||
        malv == null ||
        sotrang == null
    ) {
        res.send({ status: "failed" });
        return;
    }

    dinhkem.mv("./public/file/cvdi/" + dinhkem.name);
    const ngayravbdiInsert = new Date(body.ngayravbdi);
    ngayravbdiInsert.setDate(ngayravbdiInsert.getDate() + 1);
    const ngayvbdi = new Date();

    const tt_bosung = await TT_BoSung.create({
        sotrang,
        dinhkem: "./public/file/cvdi/" + dinhkem.name,
        dokhan,
        domat,
    });
    const savedCvdi = await CVDi.create({
        madv,
        maloai,
        tenvbdi,
        ngayravbdi: ngayravbdiInsert,
        ngayvbdi: ngayvbdi,
        malv,
        matt: tt_bosung.getDataValue("matt"),
        ttxuly: "chuaxuly",
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
