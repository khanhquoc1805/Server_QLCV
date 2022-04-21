import cloudinary from "cloudinary";
import cors from "cors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import auth from "./router/auth.js";
import bophan from "./router/BoPhan.js";
import cvden from "./router/CVDen.js";
import cvdi from "./router/CVDi.js";
import donvi from "./router/DonVi.js";
import linhvuc from "./router/LinhVuc.js";
import loaicv from "./router/LoaiCV.js";
import nhanvien from "./router/NhanVien.js";
import search from "./router/Search.js";
import socv from "./router/SoCV.js";
import tracuu from "./router/TraCuu.js";
import user from "./router/User.js";
import xuly from "./router/XuLy.js";
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

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});

app.get("/", (req, res) => {
    res.send("Hello World!");
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
