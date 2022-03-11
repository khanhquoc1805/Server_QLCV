import express from "express";
import NhanVien from "../model/NhanVien.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const auth = express.Router();

import "dotenv/config";

auth.post("/dangnhap", async function (req, res) {
    const body = req.body;
    if (body.manv !== undefined && body.matkhau !== undefined) {
        console.log(body.manv);
        const user = await NhanVien.findOne({
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
                    },
                    process.env.JWT_SECRET || "",
                    { expiresIn: "1h" }
                );
                res.send({
                    status: "success",
                    access_token: access_token,
                    manv: body.manv,
                    quyen: user.getDataValue("quyen"),
                });
                return;
            } else {
                res.send({ status: "failed", message: "Mật khẩu không chính xác!" });
            }
        } else {
            res.send({ status: "failed", message: "Tài khoản không tồn tại!" });
        }
    }
});

export default auth;
