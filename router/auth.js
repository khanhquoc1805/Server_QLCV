import express from "express";
import NhanVien from "../model/NhanVien.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const auth = express.Router();

import "dotenv/config";
import DonVi from "../model/DonVi.js";
import BoPhan from "../model/BoPhan.js";

auth.post("/dangnhap", async function (req, res) {
    const body = req.body;
    console.log(body);
    if (body.manv !== undefined && body.matkhau !== undefined) {
        //console.log(body.manv);
        const user = await NhanVien.findOne({
            include: [
                { model: DonVi, require: true },
                //{ model: BoPhan, required: true },
            ],
            where: {
                manv: body.manv,
            },
        });

        console.log(user);

        if (user) {
            const kq = await bcrypt.compare(
                body.matkhau,
                user.getDataValue("matkhau")
            );
            if (kq) {
                const access_token = jwt.sign(
                    {
                        manv: body.manv,
                        quyen: user.getDataValue("quyen"),
                        donvi: user.donvi.getDataValue("madv"),
                    },
                    process.env.JWT_SECRET || "",
                    { expiresIn: "1h" }
                );
                res.send({
                    status: "success",
                    access_token: access_token,
                    manv: body.manv,
                    quyen: user.getDataValue("quyen"),
                    //bophan: user.BoPhan.getDataValue("tenbp"),
                    donvi: user.donvi.getDataValue("madv"),
                    tennv: user.getDataValue("tennv"),
                });
                return;
            } else {
                res.send({
                    status: "failed",
                    message: "Mật khẩu không chính xác!",
                });
            }
        } else {
            res.send({ status: "failed", message: "Tài khoản không tồn tại!" });
        }
    }
});

export default auth;
