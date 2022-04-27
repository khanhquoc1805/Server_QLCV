import express from "express";
import Sequelize from "sequelize";
import FullText from "../model/FullText.js";
import { parseExcel } from "../utils/parseExcel.js";
import { readContentPDF } from "../utils/readContentPdf.js";
import { RemoveDownLine } from "../utils/RemoveDownLine.js";

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
    for (const row of firstSheet.data) {
        const insert = await FullText.create({
            text: row.text,
            content: row.content,
            noidung: row.noidung,
            title: row.title,
        });
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

export default search;
