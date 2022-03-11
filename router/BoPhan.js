import express from "express";
import BoPhan from "../model/BoPhan.js";

const bophan = express.Router();

bophan.get("", async function(req,res) {
    const data = await BoPhan.findAll({});
    res.send(data);
})

export default bophan;