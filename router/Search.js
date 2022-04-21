import express from "express";
import { readContentPDF } from "../utils/readContentPdf.js";

var search = express.Router();

search.get("/", async function (req, res) {

    const a = await readContentPDF(`${process.cwd()}/public/file/test.pdf`);
    res.send(a);
});

export default search;
