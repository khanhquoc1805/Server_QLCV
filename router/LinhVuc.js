import express from "express";
import LinhVuc from "../model/LinhVuc.js";

const linhvuc = express.Router();

linhvuc.get("", async function (req, res) {
    const data = await LinhVuc.findAll({});
    res.send(data);
});

linhvuc.post("/add", async function (req, res) {
    const body = req.body;
    if (body.tenlv == null) {
        res.send({ status: "failed" });
        return;
    }
    const lvCreate = await LinhVuc.create({
        tenlv: body.tenlv,
    });

    if(lvCreate==null) {
        res.send({ status: "failed" });
        return;
    }
    res.send({status: "successfully"});
});

export default linhvuc;
