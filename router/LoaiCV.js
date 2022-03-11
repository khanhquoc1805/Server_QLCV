import express from "express";
import LoaiCV from "../model/LoaiCV.js";

const loaicv = express.Router();

loaicv.get("", async function (req, res) {
    const data = await LoaiCV.findAll({});
    res.send(data);
});

loaicv.post("/add", async function (req, res) {
    const body = req.body;
    if (body.tenloai == null) {
        res.send({ status: "failed" });
        return;
    }
    const lcvCreate = await LoaiCV.create({
        tenloai: body.tenloai,
    });

    if (lcvCreate == null) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully" });
});

export default loaicv;
