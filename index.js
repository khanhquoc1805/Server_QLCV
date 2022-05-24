import cloudinary from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import { elasticConnect } from "./elasticConnect.js";
import auth from "./router/auth.js";
import bophan from "./router/BoPhan.js";
import cvden from "./router/CVDen.js";
import cvdi from "./router/CVDi.js";
import donvi from "./router/DonVi.js";
import linhvuc from "./router/LinhVuc.js";
import loaicv from "./router/LoaiCV.js";
import nhanvien from "./router/NhanVien.js";
import DraftCVDi from "./router/NhapCVDi.js";
import search from "./router/Search.js";
import socv from "./router/SoCV.js";
import tracuu from "./router/TraCuu.js";
import user from "./router/User.js";
import xuly from "./router/XuLy.js";
import test from "./test/elasticCVDi.js";
import demo from "./router/Demo.js";

//import NhapCVden from "./model/NhapCVDen.js";
//import Demo from "./model/Demo.js"

import { Client } from "@elastic/elasticsearch";
import DraftCVDen from "./router/NhapCVDen.js";
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

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use("/xuly", xuly);
app.use("/socv", socv);
app.use("/auth", auth);
app.use("/cvden", cvden);
app.use("/bophan", bophan);
app.use("/nhanvien", nhanvien);
app.use("/linhvuc", linhvuc);
app.use("/cvdi", cvdi);
app.use("/donvi", donvi);
app.use("/loaicv", loaicv);
app.use("/user", user);
app.use("/tracuu", tracuu);
app.use("/search", search);
app.use("/draftcvdi", DraftCVDi);
app.use("/draftcvden", DraftCVDen);
app.use("/test", test);
app.use("/demo", demo);

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

app.get("/upload", async function (req, res) {
    cloudinary.v2.uploader.upload(
        "./public/file/test.pdf",
        function (error, result) {
            console.log(result.secure_url, error);
        }
    );
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// await elasticConnect().catch(console.log);;
// client.indices.putSettings({
//     index: "demo",
//     body: { settings: { max_result_window: 350000 } },
// });

// await client.indices.delete({
//     index: "demo"
// })
