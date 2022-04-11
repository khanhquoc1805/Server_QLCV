import express from "express";
import CVDen from "../model/CVDen.js";
import NhanVien from "../model/NhanVien.js";
import XuLy from "../model/XuLy.js";

var xuly = express.Router();

xuly.post("/add", async function (req, res) {
    const macvden = req.body.macvden;
    const maxulychinh = req.body.maxulychinh;
    const butphexulychinh = req.body.butphexulychinh;
    const hanxulychinh = req.body.hanxulychinh;

    const maxulykethop = req.body.maxulykethop;
    const butphexulykethop = req.body.butphexulykethop;
    const hanxulykethop = req.body.hanxulykethop;

    if (macvden == null || maxulychinh == null) {
        res.send({ status: "failed", massage: "" });
        return;
    }

    try {
        const addXuLyChinh = await XuLy.create({
            macvden: macvden,
            manv: maxulychinh,
            trangthai: "chuaxuly",
            butphe: butphexulychinh,
            hanxuly: hanxulychinh,
            vaitro: "xulychinh",
        });
        if (maxulykethop) {
            const addXuLyKetHop = await XuLy.create({
                macvden: macvden,
                manv: maxulykethop,
                trangthai: "chuaxuly",
                butphe: butphexulykethop,
                hanxuly: hanxulykethop,
                vaitro: "xulykethop",
            });
        }

        res.send({
            status: "successfully",
            massage: "Phân công xử lý thành công",
        });
    } catch (error) {
        console.log(error);
        res.send({ status: "failed", massage: "" });
    }
});

xuly.get("/:macvden", async function (req, res) {
    const macvden = req.params.macvden;
    if (macvden == null) {
        res.send({ status: "failed" });
        return;
    }
    const data = await XuLy.findAll({
        where: {
            macvden: macvden,
        },
    });
    //console.log(data);
    let result = [];
    for (const record of data) {
        const nv = await NhanVien.findOne({
            where: {
                manv: record.getDataValue("manv"),
            },
        });
        result.push({
            xuly: record,
            nv: {
                tennv: nv.getDataValue("tennv"),
                chucvu: nv.getDataValue("chucvu"),
            },
        });
    }

    res.send(result);
});

xuly.post("/hoanthanhxuly", async function (req, res) {
    const manv = req.body.manv;
    const macvden = req.body.macvden;
    if (manv == null || macvden == null) {
        res.send({ status: "failed", massage: "" });
        return;
    }
    const nv = await NhanVien.findOne({
        where: {
            manv: manv,
        },
    });
    if (nv.getDataValue("quyen") === "lanhdao") {
        const updateStatus = await CVDen.update(
            {
                xuly: "hoanthanhxuly",
            },
            {
                where: {
                    macvden: macvden,
                },
            }
        );
        res.send({
            status: "successfully",
            massage: "Hoàn thành xử lý công văn thành công!",
        });
        return;
    }
    const kq = await XuLy.findOne({
        where: {
            manv: manv,
            macvden: macvden,
        },
    });
    if (kq == null) {
        res.send({ status: "failed", error: "Bạn không có quyền xử lý" });
        return;
    }

    const updateStatus = await XuLy.update(
        {
            trangthai: "hoanthanhxuly",
        },
        {
            where: {
                manv: manv,
                macvden: macvden,
            },
        }
    );

    res.send({
        status: "successfully",
        massage: "Xử lý công văn thành công!",
    });
});

xuly.post("/thongtinxuly/xacnhanquyenxuly", async function (req, res) {
    const macvden = req.body.macvden;
    const manv = req.body.manv;
    console.log(req.body);
    if (macvden == null || manv == null) {
        res.send({ status: "failed" });
        return;
    }
    const data = await XuLy.findOne({
        where: {
            macvden: macvden,
            manv: manv,
        },
    });
    console.log(data);
    if (data == null) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully", xuly: data });
});

export default xuly;
