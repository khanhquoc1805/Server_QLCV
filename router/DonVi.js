import express from "express";
import DonVi from "../model/DonVi.js";

const donvi = express.Router();

donvi.get("", async function (req, res) {
    const data = await DonVi.findAll({});
    res.send(data);
});

donvi.post("/add", async function (req, res) {
    const body = req.body;
    if (body.tendv == null) {
        res.send({ status: "failed" });
        return;
    }
    const dvCreate = await DonVi.create({
        tendv: body.tendv,
    });

    if (dvCreate == null) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully" });
});

donvi.get("/:madv", async function (req, res) {
    const madv = req.params.madv;

    if (madv == null) {
        res.send({ status: "failed" });
        return;
    }

    const data = await DonVi.findOne({
        where: {
            madv: madv,
        },
    });

    res.send(data);
});

export default donvi;
