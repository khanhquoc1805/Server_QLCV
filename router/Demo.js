import { Client } from "@elastic/elasticsearch";
import express, { request } from "express";
import { Op } from "sequelize";


import Demo from "../model/Demo.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import { parseExcel } from "../utils/parseExcel.js";
import removeVietnameseTones from "../utils/removeVNTones.js";

const demo = express.Router();

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

demo.post("/add", async function (req, res) {
    const body = req.body;
    //const dinhkem = req.files.dinhkem;

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

    let i = 0;
    for (let j = 0; j < 100; j++) {
        for (const row of firstSheet.data) {
            const data = await Demo.create({
                maloai: row.maloai,
                trichyeu: row.trichyeu,
                malv: row.malv,
                coquanbanhanh: row.coquanbanhanh,
                madv: row.madv,
            });

            await client.index({
                index: "demo",
                document: {
                    maloai: row.maloai,
                    trichyeu: row.trichyeu,
                    malv: row.malv,
                    coquanbanhanh: row.coquanbanhanh,
                    madv: row.madv,
                },
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

demo.get("", async function (req, res) {
    const { limit, page, textSearch, madv } = req.query;
    let data = [];
    let totalRows = 0;

    //console.log(madv);

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    const a = new Date().getTime();
    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }
    var stuff = [];

    await client.indices.refresh({ index: "demo" });
    let temp = [];
    //const statusList = status.split(",");
    totalRows = (
        await client.search({
            index: "demo",
            search_type: "query_then_fetch",
            from: 0,
            size: 200000,
        })
    ).hits.hits.length;
    console.log(totalRows);

    temp = (
        await client.search({
            index: "demo",
            search_type: "query_then_fetch",

            from: (pageInt - 1) * limitInt,
            size: limitInt,
            // body: {
            //     query: {
            //        match: {
            //            madv : madv
            //        }
            //     },
            // },
        })
    ).hits.hits;

    if (textSearch !== undefined && textSearch !== "") {
        totalRows = (
            await client.search({
                index: "demo",
                search_type: "query_then_fetch",
                from: 0,
                size: 200000,
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        trichyeu: textSearch,
                                    },
                                },
                                // {
                                //     terms: {
                                //         ttxuly: statusList,
                                //     },
                                // },
                            ],
                        },
                    },
                },
            })
        ).hits.hits.length;
        temp = (
            await client.search({
                index: "demo",
                search_type: "query_then_fetch",
                from: (pageInt - 1) * limitInt,
                size: limitInt,
                body: {
                    query: {
                        bool: {
                            must: [
                                {
                                    match: {
                                        trichyeu: textSearch,
                                    },
                                },
                                // {
                                //     terms: {
                                //         ttxuly: statusList,
                                //     },
                                // },
                            ],
                        },
                    },
                },
            })
        ).hits.hits;
    }

    // const result = [];
    // for (const record of temp) {
    //     const demo = record._source;
    //     result.push({
    //         data: demo,
    //     });
    // }
    let result = [];
    for (const row of temp) {
        const linhvuc = await LinhVuc.findOne({
            where: {
                malv: row._source.malv,
            },
        });
        const donvi = await DonVi.findOne({
            where: {
                madv: row._source.madv,
            },
        });
        const loaicv = await LoaiCV.findOne({
            where: {
                maloai: row._source.maloai,
            },
        });
        result.push({
            data: row._source,
            linhvuc: linhvuc,
            donvi: donvi,
            loaicv: loaicv,
        });
    }
    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    const b = new Date().getTime();
    const time = b - a;
    res.send({ data: result, pagination, time });

    // const pagination = {
    //     page: pageInt,
    //     limit: limitInt,
    //     totalRows: totalRows,
    // };
    // const b = new Date().getTime();
    // const time = b - a;
    // res.send({ data: result, pagination, time });
});

demo.get("/truyenthong", async function (req, res) {
    const { limit, page, status, textSearch, madv } = req.query;
    let data = [];

    console.log(textSearch);

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    const a = new Date().getTime();
    if (!limit || !page) {
        res.send({ status: "failed" });
        return;
    }
    let totalRows = 0;

    // get all cong van di
    //const range = 1000;
    totalRows = (
        await Demo.findAll({
            where: {
                madv: madv,
            },
        })
    ).length;

    let temp = await Demo.findAll({
        where: {
            madv: madv,
        },
        offset: (pageInt - 1) * limitInt,
        limit: limitInt,
    });

    // status=daxuly,chuaxuly

    if (textSearch !== undefined && textSearch !== "") {
        totalRows = (
            await Demo.findAll({
                where: {
                    [Op.or]: [
                        {
                            trichyeu: {
                                [Op.like]: `%${textSearch}%`,
                            },
                        },
                        {
                            coquanbanhanh: {
                                [Op.like]: `%${textSearch}%`,
                            },
                        },
                    ],
                },
            })
        ).length;
        temp = await Demo.findAll({
            where: {
                [Op.or]: [
                    {
                        trichyeu: {
                            [Op.like]: `%${textSearch}%`,
                        },
                    },
                    {
                        coquanbanhanh: {
                            [Op.like]: `%${textSearch}%`,
                        },
                    },
                ],
            },
            offset: (pageInt - 1) * limitInt,
            limit: limitInt,
        });
    }

    // temp.splice(0, (pageInt - 1) * limitInt);
    // data = temp.slice(0, limitInt);
    let result = [];
    for (const row of temp) {
        const linhvuc = await LinhVuc.findOne({
            where: {
                malv: row.getDataValue("malv"),
            },
        });
        const donvi = await DonVi.findOne({
            where: {
                madv: row.getDataValue("madv"),
            },
        });
        const loaicv = await LoaiCV.findOne({
            where: {
                maloai: row.getDataValue("maloai"),
            },
        });
        result.push({
            data: row,
            linhvuc: linhvuc,
            donvi: donvi,
            loaicv: loaicv,
        });
    }
    const pagination = {
        page: pageInt,
        limit: limitInt,
        totalRows: totalRows,
    };
    const b = new Date().getTime();
    const time = b - a;
    res.send({ data: result, pagination, time });
});

export default demo;
