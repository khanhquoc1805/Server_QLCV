import express from "express";
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
        res.send(values);
        return;
    }

    res.send("k chay vo daua");
});

export default DraftCVDi;
