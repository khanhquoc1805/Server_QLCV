import express from "express";
import CVDi from "../model/CVDi.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { readContentPDF } from "../utils/readContentPdf.js";
import fs from "fs";
import TT_BoSung from "../model/TT_BoSung.js";
import NoiNhanCVDi from "../model/NoiNhanCVDi.js";
import NhapCVdi from "../model/NhapCVDi.js";
import XuLyCVDi from "../model/XuLyCVDi.js";
import { Client } from "@elastic/elasticsearch";
import { parseExcel } from "../utils/parseExcel.js";
import LoaiCV from "../model/LoaiCV.js";
import LinhVuc from "../model/LinhVuc.js";
import DonVi from "../model/DonVi.js";
import NhanVien from "../model/NhanVien.js";
import { getLengthData } from "../utils/lengthData.js";
import CVDen from "../model/CVDen.js";
import { createSoDen } from "../utils/createSoDen.js";

const test = express.Router();

const client = new Client({
    node: "https://localhost:9200",
    auth: {
        username: "elastic",
        password: "6eKNq=2eMcLtlsk_XlCP",
    },
    tls: {
        ca: "59ef13b1c8a2f03e13cb9d70036591cbb66073e53a88f027aef26556070bbc27",
        rejectUnauthorized: false,
    },
});

test.get("", async function (req, res) {
    const { limit, page, status, textSearch, madv } = req.query;
    let data = [];
    let totalRows = 0;
    console.log(req.query);

    console.log(madv);

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    if (!limit || !page || !madv || !status) {
        res.send({ status: "failed" });
        return;
    }
    var stuff = [];

    // await client.update({
    //     index: "cvdi",
    //     id: "2",
    //     body: {
    //         doc: {

    //             ttxuly: "hoanthanhxuly",
    //         },

    //     },
    // });
    await client.indices.refresh({ index: "cvdi" });
    let temp = [];
    const statusList = status.split(",");
    totalRows = (
        await client.search({
            index: "cvdi",
            search_type: "query_then_fetch",
            from: 0,
            size: 60000,
            body: {
                query: {
                    terms: {
                        ttxuly: statusList,
                    },
                },
            },
        })
    ).hits.hits.length;
    // totalRows = await getLengthData(
    //     {
    //         index: "cvdi",
    //         search_type: "query_then_fetch",
    //         scroll: '2s',
    //         body: {
    //             query: {
    //                 terms: {
    //                     ttxuly: statusList,
    //                 },
    //             },
    //         },
    //     },
    //     client
    // );
    console.log(totalRows);

    // const a = await searchstuff({
    //     index: "cvdi",
    //     search_type: "query_then_fetch",

    //     // from: (pageInt - 1) * limitInt,
    //     size: 4,
    //     body: {
    //         query: {
    //             terms: {
    //                 ttxuly: statusList,
    //             },
    //         },
    //     },
    // });

    // console.log(a);

    temp = (
        await client.search({
            index: "cvdi",
            search_type: "query_then_fetch",

            from: (pageInt - 1) * limitInt,
            size: limitInt,
            body: {
                query: {
                    terms: {
                        ttxuly: statusList,
                    },
                },
            },

            // "search_after": [1463538857, "654323"],
            // "sort": [
            //     {"date": "asc"},
            //     {"_id": "desc"}
            // ]
        })
    ).hits.hits;

    //console.log(temp);

    if (textSearch !== undefined && textSearch !== "") {
        totalRows = (
            await client.search({
                index: "cvdi",
                search_type: "query_then_fetch",
                from: 0,
                size: 60000,
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        tenvbdi: textSearch,
                                    },
                                },
                                {
                                    terms: {
                                        ttxuly: statusList,
                                    },
                                },
                            ],
                        },
                    },
                },
            })
        ).hits.hits.length;
        temp = (
            await client.search({
                index: "cvdi",
                search_type: "query_then_fetch",
                from: (pageInt - 1) * limitInt,
                size: limitInt,
                body: {
                    query: {
                        match: {
                            tenvbdi: textSearch,
                        },
                    },
                },
                //scroll: "1m",
            })
        ).hits.hits;

        //console.log(temp);
    }
    // }

    // // status=daxuly,chuaxuly
    // // if (status) {
    // //     const statusList = status.split(",");
    // //     temp = temp.filter((cvdi) => {
    // //         return statusList.includes(cvdi.getDataValue("ttxuly"));
    // //     });

    // // }

    // // if (textSearch !== undefined) {
    // //     temp = temp.filter((cvdi) => {
    // //         return (
    // //             removeVietnameseTones(cvdi.getDataValue("tenvbdi"))
    // //                 .toLowerCase()
    // //                 .includes(
    // //                     removeVietnameseTones(textSearch).toLowerCase()
    // //                 ) ||
    // //             removeVietnameseTones(
    // //                 cvdi.getDataValue("LinhVuc").getDataValue("tenlv")
    // //             )
    // //                 .toLowerCase()
    // //                 .includes(
    // //                     removeVietnameseTones(textSearch).toLowerCase()
    // //                 ) ||
    // //             removeVietnameseTones(
    // //                 cvdi.getDataValue("LoaiCV").getDataValue("tenloai")
    // //             )
    // //                 .toLowerCase()
    // //                 .includes(removeVietnameseTones(textSearch).toLowerCase())
    // //         );
    // //     });
    // // }

    // // let totalRows = elasticData.length;
    // // elasticData.splice(0, (pageInt - 1) * limitInt);
    // // data = elasticData.slice(0, limitInt);
    const result = [];
    for (const record of temp) {
        const cvdi = await CVDi.findOne({
            where: {
                mavbdi: record._source.mavbdi,
            },
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
        });
        const ttbosung = await TT_BoSung.findOne({
            where: {
                matt: record._source.matt,
            },
        });
        const loaiCV = await LoaiCV.findOne({
            where: {
                maloai: record._source.maloai,
            },
        });

        const linhVuc = await LinhVuc.findOne({
            where: {
                malv: record._source.malv,
            },
        });
        const noinhan = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: record._source.mavbdi,
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
                mavbdi: record._source.mavbdi,
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
            cvdi: cvdi,
            ttbosung: ttbosung,
            loaicv: loaiCV,
            donvi: donvi,
            linhvuc: linhVuc,
            duthao: duthao,
        });
    }
    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    res.send({ data: result, pagination });
});

test.post("/add", async function (req, res) {
    const body = req.body;
    const dinhkem = req.files.dinhkem;
    const madv = body.madv;
    const maloai = body.maloai;
    const tenvbdi = body.tenvbdi;
    const ngayravbdi = body.ngayravbdi;
    const dokhan = body.dokhan;
    const domat = body.domat;
    const malv = body.malv;
    const manv = body.manv;
    // const iddraft = body.iddraft;
    // console.log(iddraft);

    const upload = req.files.upload;
    await upload.mv(`${process.cwd()}/private/file/${upload.name}`);

    const firstSheet = parseExcel(
        `${process.cwd()}/private/file/${upload.name}`
    )[0];

    // if (
    //     madv == null ||
    //     maloai == null ||
    //     tenvbdi == null ||
    //     ngayravbdi == null ||
    //     dinhkem == null ||
    //     dokhan == null ||
    //     domat == null ||
    //     malv == null ||
    //     manv == null
    // ) {
    //     res.send({ status: "failed" });
    //     return;
    // }

    // await dinhkem.mv(`${process.cwd()}/public/file/cvdi/` + dinhkem.name);
    // const pdf = await readContentPDF(
    //     `${process.cwd()}/public/file/cvdi/` + dinhkem.name
    // );
    // const url = await uploadToCloudinary(
    //     `${process.cwd()}/public/file/cvdi/` + dinhkem.name
    // );
    // console.log(url);

    // fs.unlink(`${process.cwd()}/public/file/cvdi/` + dinhkem.name, (err) => {
    //     if (err) {
    //         throw err;
    //     }
    // });

    const ngayvbdi = new Date();

    let i = 0;
    for (let j = 0; j < 55; j++) {
        for (const row of firstSheet.data) {
            const ngayravbdiInsert = new Date(row.ngayravbdi);
            ngayravbdiInsert.setDate(ngayravbdiInsert.getDate() + 1);

            const tt_bosung = await TT_BoSung.create({
                sotrang: 0,
                dinhkem: "url.secure_url",
                dokhan,
                domat,
                noidung: "pdf.text",
            });
            const savedCvdi = await CVDi.create({
                maloai: row.maloai,
                tenvbdi: row.tenvbdi,
                ngayravbdi: ngayravbdiInsert,
                ngayvbdi: ngayvbdi,
                malv: row.malv,
                matt: tt_bosung.getDataValue("matt"),
                ttxuly: "chuaxuly",
            });

            await client.index({
                index: "cvdi",
                document: {
                    maloai: row.maloai,
                    tenvbdi: row.tenvbdi,
                    ngayravbdi: ngayravbdiInsert,
                    ngayvbdi: ngayvbdi,
                    malv: row.malv,
                    matt: tt_bosung.getDataValue("matt"),
                    ttxuly: "chuaxuly",
                    mavbdi: savedCvdi.getDataValue("mavbdi"),
                },
            });

            const noinhancvdi = NoiNhanCVDi.create({
                mavbdi: savedCvdi.getDataValue("mavbdi"),
                madv: row.madv,
                ghichu: "gui",
            });
            const insertNVDuThao = await XuLyCVDi.create({
                manv: "0000" + row.manv,
                mavbdi: savedCvdi.getDataValue("mavbdi"),
                vaitro: "duthao",
            });
            console.log(++i);
        }
    }

    //     const deleteDraft = await NhapCVdi.destroy({
    //         where: {
    //             iddraft: iddraft,
    //         },
    //     });
    res.send({ status: "successfully" });
});

test.get("/soden", async function (req, res) {
    const a =  await createSoDen(7,2);
    res.send(a);
});

export default test;
