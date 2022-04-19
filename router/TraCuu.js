import express from "express";
import CVDen from "../model/CVDen.js";
import CVDi from "../model/CVDi.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import NhanVien from "../model/NhanVien.js";
import NoiNhanCVDi from "../model/NoiNhanCVDi.js";
import TT_BoSung from "../model/TT_BoSung.js";
import XuLyCVDi from "../model/XuLyCVDi.js";
import removeVietnameseTones from "../utils/removeVNTones.js";
var tracuu = express.Router();

tracuu.get("/", async function (req, res) {
    const { limit, page, madv, textSearch, month, year, loaicv } = req.query;

    let data = [];
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }
    let temp = [];
    let result = [];
    let totalRows = 0;
    if (loaicv) {
        if (loaicv === "cvden") {
            temp = await CVDen.findAll({
                include: [
                    {
                        model: LinhVuc,
                        required: true,
                    },
                    {
                        model: LoaiCV,
                        required: true,
                    },
                ],
                where: {
                    madv: madv || 0,
                },
            });

            if (textSearch !== undefined) {
                temp = temp.filter((cvden) => {
                    return (
                        removeVietnameseTones(cvden.getDataValue("tencvden"))
                            .toLowerCase()
                            .includes(
                                removeVietnameseTones(textSearch).toLowerCase()
                            ) ||
                        removeVietnameseTones(
                            cvden.getDataValue("LinhVuc").getDataValue("tenlv")
                        )
                            .toLowerCase()
                            .includes(
                                removeVietnameseTones(textSearch).toLowerCase()
                            ) ||
                        removeVietnameseTones(
                            cvden.getDataValue("LoaiCV").getDataValue("tenloai")
                        )
                            .toLowerCase()
                            .includes(
                                removeVietnameseTones(textSearch).toLowerCase()
                            )
                    );
                });
            }
            if (month) {
                temp = temp.filter((cvden) => {
                    const date = new Date(cvden.getDataValue("ngaycvden"));

                    return date.getMonth() + 1 === parseInt(month);
                });
            }
            if (year) {
                temp = temp.filter((cvden) => {
                    const date = new Date(cvden.getDataValue("ngaycvden"));
                    return date.getFullYear() === parseInt(year);
                });
            }
            totalRows = temp.length;
            temp.splice(0, (pageInt - 1) * limitInt);
            data = temp.slice(0, limitInt);

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
                    data: record,
                    ttbosung: ttbosung,
                    donvi: donVi,
                    loaicv: loaiCV,
                    linhvuc: linhVuc,
                    phanloai: loaicv,
                });
            }
        }
        if (loaicv === "cvdi") {
            temp = await CVDi.findAll({
                include: [
                    {
                        model: NoiNhanCVDi,
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
                where: {
                    "$NoiNhanCVDi.madv$": madv,
                    "$NoiNhanCVDi.ghichu$": "gui",
                },
            });

            if (textSearch !== undefined) {
                temp = temp.filter((cvdi) => {
                    return (
                        removeVietnameseTones(cvdi.getDataValue("tenvbdi"))
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
                            .includes(
                                removeVietnameseTones(textSearch).toLowerCase()
                            )
                    );
                });
            }

            if (month) {
                temp = temp.filter((cvdi) => {
                    const date = new Date(cvdi.getDataValue("ngayvbdi"));

                    return date.getMonth() + 1 === parseInt(month);
                });
            }
            if (year) {
                temp = temp.filter((cvdi) => {
                    const date = new Date(cvdi.getDataValue("ngayvbdi"));
                    return date.getFullYear() === parseInt(year);
                });
            }

            totalRows = temp.length;
            temp.splice(0, (pageInt - 1) * limitInt);
            data = temp.slice(0, limitInt);
            for (const record of data) {
                const ttbosung = await TT_BoSung.findOne({
                    where: {
                        matt: record.getDataValue("matt"),
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
                const noinhan = await NoiNhanCVDi.findOne({
                    where: {
                        mavbdi: record.getDataValue("mavbdi"),
                        madv: madv,
                        ghichu: "gui",
                    },
                });
                let donvi;
                if (!noinhan) {
                    donvi = { madv: 0, tendv: "" };
                } else {
                    donvi = await DonVi.findOne({
                        where: {
                            madv: noinhan.getDataValue("madv"),
                        },
                    });
                }

                const canbo = await XuLyCVDi.findOne({
                    where: {
                        mavbdi: record.getDataValue("mavbdi"),
                        vaitro: "duthao",
                    },
                }); // tim ma can bo du thao

                const duthao = await NhanVien.findOne({
                    attributes: ["tennv"],
                    where: {
                        manv: canbo.getDataValue("manv"),
                    },
                }); // tim ten can bo du thao

                result.push({
                    data: record,
                    ttbosung: ttbosung,
                    loaicv: loaiCV,
                    donvi: donvi,
                    linhvuc: linhVuc,
                    duthao: duthao,
                    phanloai: loaicv,
                });
            }
        }

        const pagination = {
            page: pageInt,
            limit: limitInt,
            totalRows: totalRows,
        };
        res.send({ data: result, pagination });
        return;
    }
});

export default tracuu;
