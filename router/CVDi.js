import express from "express";
import CVDi from "../model/CVDi.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";
import LoaiCV from "../model/LoaiCV.js";
import TT_BoSung from "../model/TT_BoSung.js";
import removeVietnameseTones from "../utils/removeVNTones.js";
import cloudinary from "cloudinary";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import NhanVien from "../model/NhanVien.js";
import NoiNhanCVDi from "../model/NoiNhanCVDi.js";
import XulyCVDi from "../model/XuLyCVDi.js";
import XuLyCVDi from "../model/XuLyCVDi.js";
import CVDen from "../model/CVDen.js";
import { readContentPDF } from "../utils/readContentPdf.js";
import NhapCVdi from "../model/NhapCVDi.js";

const cvdi = express.Router();

cvdi.get("", async function (req, res) {
    const { limit, page, status, textSearch, madv } = req.query;
    let data = [];

    console.log(madv);

    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    if (!limit || !page || !madv) {
        res.send({ status: "failed" });
        return;
    }

    // get all cong van di
    let temp = await CVDi.findAll({
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

    // status=daxuly,chuaxuly
    if (status) {
        const statusList = status.split(",");
        temp = temp.filter((cvdi) => {
            return statusList.includes(cvdi.getDataValue("ttxuly"));
        });
    }

    if (textSearch !== undefined) {
        temp = temp.filter((cvdi) => {
            return (
                removeVietnameseTones(cvdi.getDataValue("tenvbdi"))
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvdi.getDataValue("LinhVuc").getDataValue("tenlv")
                )
                    .toLowerCase()
                    .includes(
                        removeVietnameseTones(textSearch).toLowerCase()
                    ) ||
                removeVietnameseTones(
                    cvdi.getDataValue("LoaiCV").getDataValue("tenloai")
                )
                    .toLowerCase()
                    .includes(removeVietnameseTones(textSearch).toLowerCase())
            );
        });
    }

    let totalRows = temp.length;
    temp.splice(0, (pageInt - 1) * limitInt);
    data = temp.slice(0, limitInt);
    const result = [];
    for (const record of data) {
        const ttbosung = await TT_BoSung.findOne({
            where: {
                matt: record.getDataValue("matt"),
            },
        });
        const loaiCV = await LoaiCV.findOne({
            where: {
                maloai: record.getDataValue("maloai"),
            },
        });

        const linhVuc = await LinhVuc.findOne({
            where: {
                malv: record.getDataValue("malv"),
            },
        });
        const noinhan = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: record.getDataValue("mavbdi"),
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
                mavbdi: record.getDataValue("mavbdi"),
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
            cvdi: record,
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

cvdi.get("/:mavbdi", async function (req, res) {
    const mavbdi = req.params.mavbdi;
    if (mavbdi == null) {
        res.send({ status: "error" });
        return;
    }

    const data = await CVDi.findOne({
        where: {
            mavbdi: mavbdi,
        },
    });

    if (data) {
        const ttbosung = await TT_BoSung.findOne({
            where: {
                matt: data.getDataValue("matt"),
            },
        });
        const loaiCV = await LoaiCV.findOne({
            where: {
                maloai: data.getDataValue("maloai"),
            },
        });

        const linhVuc = await LinhVuc.findOne({
            where: {
                malv: data.getDataValue("malv"),
            },
        });
        const noinhan = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: data.getDataValue("mavbdi"),
                ghichu: "gui",
            },
        });

        const donvi = await DonVi.findOne({
            where: {
                madv: noinhan.getDataValue("madv"),
            },
        });

        res.send({
            cvdi: data,
            ttbosung: ttbosung,
            loaicv: loaiCV,
            donvi: donvi,
            linhvuc: linhVuc,
        });
    } else {
        res.send({ status: "failed" });
    }
});

cvdi.post("/add", async function (req, res) {
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
    const iddraft = body.iddraft;
    console.log(iddraft);

    if (
        madv == null ||
        maloai == null ||
        tenvbdi == null ||
        ngayravbdi == null ||
        dinhkem == null ||
        dokhan == null ||
        domat == null ||
        malv == null ||
        manv == null
    ) {
        res.send({ status: "failed" });
        return;
    }

    await dinhkem.mv(`${process.cwd()}/public/file/cvdi/` + dinhkem.name);
    const pdf = await readContentPDF(
        `${process.cwd()}/public/file/cvdi/` + dinhkem.name
    );
    const url = await uploadToCloudinary(
        `${process.cwd()}/public/file/cvdi/` + dinhkem.name
    );
    console.log(url);

    fs.unlink(`${process.cwd()}/public/file/cvdi/` + dinhkem.name, (err) => {
        if (err) {
            throw err;
        }
    });

    const ngayravbdiInsert = new Date(body.ngayravbdi);
    ngayravbdiInsert.setDate(ngayravbdiInsert.getDate() + 1);
    const ngayvbdi = new Date();

    const tt_bosung = await TT_BoSung.create({
        sotrang: pdf.numpages,
        dinhkem: url.secure_url,
        dokhan,
        domat,
        noidung: pdf.text,
    });
    const savedCvdi = await CVDi.create({
        maloai,
        tenvbdi,
        ngayravbdi: ngayravbdiInsert,
        ngayvbdi: ngayvbdi,
        malv,
        matt: tt_bosung.getDataValue("matt"),
        ttxuly: "chuaxuly",
    });
    const noinhancvdi = NoiNhanCVDi.create({
        mavbdi: savedCvdi.getDataValue("mavbdi"),
        madv: madv,
        ghichu: "gui",
    });
    const insertNVDuThao = await XulyCVDi.create({
        manv: manv,
        mavbdi: savedCvdi.getDataValue("mavbdi"),
        vaitro: "duthao",
    });

    const deleteDraft = await NhapCVdi.destroy({
        where: {
            iddraft: iddraft,
        },
    });
    res.send({ status: "successfully" });
});

// cvdi.post("/xulytrangthai/:mavbdi", async function (req, res) {
//     const mavbdi = parseInt(req.params.mavbdi);

//     if (Number.isNaN(mavbdi)) {
//         res.send({ status: "failed" });
//         return;
//     }
//     const cvdi = await CVDi.update(
//         {
//             ttxuly: "daduyet",
//         },
//         {
//             where: {
//                 mavbdi: mavbdi,
//             },
//         }
//     );
//     if (cvdi <= 0) {
//         res.send({ status: "failed" });
//         return;
//     }
//     res.send({ status: "successfully" });
// });

cvdi.post("/chuyenxuly", async function (req, res) {
    const { nguoinhan, butphechuyen, hanxuly, mavbdi } = req.body;
    if (nguoinhan === null || mavbdi == null) {
        res.send({ status: "failed", massage: "lỗi chưa xác định" });
        return;
    }
    const hanxulyInsert = new Date(hanxuly);
    hanxulyInsert.setDate(hanxulyInsert.getDate() + 1);
    const insertXuLy = await XuLyCVDi.create({
        mavbdi: mavbdi,
        manv: nguoinhan,
        trangthai: "chuaxuly",
        butphe: butphechuyen,
        hanxuly: hanxulyInsert,
        vaitro: "xuly",
    });
    res.send({ status: "successfully", massage: "Chuyển xử lý thành công!" });
});

cvdi.post("/themvaoso/:mavbdi", async function (req, res) {
    const mavbdi = parseInt(req.params.mavbdi);
    const masocv = req.body.masocv;
    if (Number.isNaN(mavbdi) || !masocv) {
        res.send({ status: "failed" });
        return;
    }
    const update = await CVDi.update(
        {
            masocv: masocv,
            ttxuly: "davaoso",
        },
        {
            where: {
                mavbdi: mavbdi,
            },
        }
    );
    if (update <= 0) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully" });
});

cvdi.post("/thongtinxuly/xacnhanquyenxuly", async function (req, res) {
    const { mavbdi, manv } = req.body;
    if (mavbdi == null || manv == null) {
        res.send({ status: "failed" });
        return;
    }
    console.log(req.body);
    const per = await XuLyCVDi.findOne({
        where: {
            manv: manv,
            mavbdi: mavbdi,
            vaitro: "xuly",
        },
    });
    console.log(per);
    if (!per) {
        res.send({ status: "failed" });
        return;
    }
    res.send({ status: "successfully", xuly: per });
});

cvdi.post("/hoanthanhxuly", async function (req, res) {
    const { manv, mavbdi } = req.body;
    if (manv == null || mavbdi == null) {
        res.send({ status: "failed", massage: "" });
        return;
    }
    const nv = await NhanVien.findOne({
        where: {
            manv: manv,
        },
    });

    if (nv.getDataValue("quyen") === "lanhdao") {
        const updateStatus = await CVDi.update(
            {
                ttxuly: "hoanthanhxuly",
            },
            {
                where: {
                    mavbdi: mavbdi,
                },
            }
        );

        const updateNguoiKy = await CVDi.update(
            {
                nguoiky: `${nv.getDataValue("tennv")}/${nv.getDataValue(
                    "chucvu"
                )}`,
            },
            {
                where: {
                    mavbdi: mavbdi,
                },
            }
        );

        res.send({
            status: "successfully",
            massage: "Hoàn thành xử lý công văn thành công!",
        });
        return;
    }

    const kq = await XulyCVDi.findOne({
        where: {
            mavbdi: mavbdi,
            manv: manv,
            vaitro: "xuly",
        },
    });

    if (kq == null) {
        res.send({ status: "failed", error: "Bạn không có quyền xử lý" });
        return;
    }

    const updateStatus = await XulyCVDi.update(
        {
            trangthai: "hoanthanhxuly",
        },
        {
            where: {
                mavbdi: mavbdi,
                manv: manv,
            },
        }
    );

    res.send({
        status: "successfully",
        massage: "Xử lý công văn thành công!",
    });
});

cvdi.get("/thongtin/:mavbdi", async function (req, res) {
    const mavbdi = req.params.mavbdi;
    if (mavbdi == null) {
        res.send({ status: "failed" });
        return;
    }
    const data = await XuLyCVDi.findAll({
        where: {
            mavbdi: mavbdi,
            vaitro: "xuly",
        },
    });
    let result = [];
    for (const record of data) {
        const nv = await NhanVien.findOne({
            attributes: ["tennv", "chucvu"],
            where: {
                manv: record.getDataValue("manv"),
            },
        });
        console.log(nv);
        result.push({ xuly: record, nv: nv });
    }

    res.send(result);
});

cvdi.post("/themnoinhan", async function (req, res) {
    const { mavbdi, dsnoinhan } = req.body;
    console.log(req.body);

    if (mavbdi == null || dsnoinhan == null) {
        res.send({ status: "failed", massage: "" });
        return;
    }
    const data = await CVDi.findOne({
        where: {
            mavbdi: mavbdi,
        },
    });
    for (const madv of dsnoinhan) {
        //console.log(madv);
        const add = await NoiNhanCVDi.create({
            mavbdi: mavbdi,
            madv: madv,
            ghichu: "nhan",
        });
        const noibanhanh = await NoiNhanCVDi.findOne({
            where: {
                mavbdi: mavbdi,
                ghichu: "gui",
            },
        });
        console.log(noibanhanh);
        const tennoibanhanh = await DonVi.findOne({
            where: {
                madv: noibanhanh.getDataValue("madv"),
            },
        });
        const ngaybh = new Date();
        const insertCvCungHeThong = await CVDen.create({
            tencvden: data.getDataValue("tenvbdi"),
            ngaybanhanh: ngaybh,
            ngaycvden: data.getDataValue("ngayvbdi"),
            xuly: "chotiepnhan",
            coquanbanhanh: tennoibanhanh.getDataValue("tendv"),
            maloai: data.getDataValue("maloai"),
            matt: data.getDataValue("matt"),
            malv: data.getDataValue("malv"),
            madv: madv,
            nguoiky: data.getDataValue("nguoiky"),
        });
    }
    const vbdi = await CVDi.update(
        {
            ttxuly: "daphathanh",
        },
        {
            where: {
                mavbdi: mavbdi,
            },
        }
    );

    res.send({ status: "successfully", massage: "Thành công" });
});

cvdi.post("/delete/:mavbdi", async function (req, res) {
    const mavbdi = req.params.mavbdi;
    console.log(mavbdi);

    if (!mavbdi) {
        res.send({ status: "error" });
        return;
    }

    const vbdi = await CVDi.findOne({
        where: {
            mavbdi: mavbdi,
        },
    });

    const deleteNoiNhanCVDi = await NoiNhanCVDi.destroy({
        where: {
            mavbdi: mavbdi,
        },
    });

    const deleteXuLyCVDi = await XuLyCVDi.destroy({
        where: {
            mavbdi: mavbdi,
        },
    });

    const deleteCVDi = await CVDi.destroy({
        where: {
            mavbdi: mavbdi,
        },
    });

    const deleteTTBS = await TT_BoSung.destroy({
        where: {
            matt: vbdi.getDataValue("matt"),
        },
    });

    res.send({ status: "successfully" });
});

export default cvdi;
