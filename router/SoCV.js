import express from "express";
import DonVi from "../model/DonVi.js";
import SoCV from "../model/SoCV.js";

var socv = express.Router();

socv.get("", async function (req, res) {
    const { limit, page } = req.query;
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);

    let temp = await SoCV.findAll({
        include: {
            model: DonVi,
            required: true,
        },
    });
    let data = temp;

    let totalRows = temp.length;

    // logic phan trang
    if (!Number.isNaN(limitInt) && !Number.isNaN(pageInt)) {
        temp.splice(0, (pageInt - 1) * limitInt);
        data = temp.slice(0, limitInt);
    }
    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    res.send({ data, pagination });
});

socv.post("/add", async function (req, res) {
    const body = req.body;
    console.log(body);

    if (
        body.masocv !== undefined &&
        body.tensocv !== undefined &&
        body.nhomsocv !== undefined &&
        body.madv !== undefined
    ) {
        try {
            const newSoCV = await SoCV.create({
                masocv: body.masocv,
                tensocv: body.tensocv,
                nhomsocv: body.nhomsocv,
                madv: body.madv,
            });
            res.send({ status: "success" });
        } catch (error) {
            res.send({ status: "failed" });
        }
        return;
    }
    res.send({ status: "failed" });
});

socv.get("/delete/:masocv", async function (req, res) {
    const masocv = req.params.masocv;

    if (masocv !== undefined) {
        await SoCV.destroy({
            where: {
                masocv: masocv,
            },
        });

        res.send({ status: "success" });
    } else {
        res.send({ status: "failed" });
    }
});

export default socv;
