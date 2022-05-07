import express from "express";
import Sequelize from "sequelize";
import FullText from "../model/FullText.js";
import { parseExcel } from "../utils/parseExcel.js";
import { readContentPDF } from "../utils/readContentPdf.js";
import { RemoveDownLine } from "../utils/RemoveDownLine.js";

import { Client } from "@elastic/elasticsearch";
import { getLengthData } from "../utils/lengthData.js";
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

var search = express.Router();

search.get("/", async function (req, res) {
    const a = await readContentPDF(`${process.cwd()}/public/file/test.pdf`);
    res.send(RemoveDownLine(a.text));
});

search.post("/", async function (req, res) {
    const upload = req.files.upload;
    await upload.mv(`${process.cwd()}/private/file/${upload.name}`);

    const firstSheet = parseExcel(
        `${process.cwd()}/private/file/${upload.name}`
    )[0];

    const dataResult = [];
    let i = 0;
    for (const row of firstSheet.data) {
        const insert = await FullText.create({
            text: row.text,
            content: row.content,
            noidung: row.noidung,
            title: row.title,
        });
        await client.index({
            index: "search",
            document: {
                text: row.text,
                content: row.content,
                noidung: row.noidung,
                title: row.title,
            },
        });

        console.log(++i);
    }

    res.send("ok");
});

search.get("/fulltext", async function (req, res) {
    const text = req.query.text;

    const a = await FullText.findAll({
        where: Sequelize.literal("MATCH (text) AGAINST (:name)"),
        replacements: {
            name: text,
        },
    });
    console.log(a);
    res.send(a);
});

search.get("/scroll", async function (req, res) {
    const params = {
        index: "cvdi",
        scroll: "10s",
        body: {
            query: {
                terms: {
                    ttxuly: ["chuaxuly"],
                },
            },
            _source: false,
        },
    };

    const length = await getLengthData(params, client);

    res.send({ length: length });
});

export default search;
