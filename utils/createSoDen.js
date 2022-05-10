import CVDen from "../model/CVDen.js";
import DonVi from "../model/DonVi.js";
import LinhVuc from "../model/LinhVuc.js";

export async function createSoDen(malv, madv) {
    let stt =
        (
            await CVDen.findAll({
                where: {
                    madv: madv,
                },
            })
        ).length + 1;
    if (stt < 10) {
        stt = `0${stt}`;
    }
    const year = new Date().getFullYear();

    const linhvuc = await LinhVuc.findOne({
        where: {
            malv: malv,
        },
    });

    const donvi = await DonVi.findOne({
        where: {
            madv: madv,
        },
    });

    let lv = linhvuc.getDataValue("tenlv");
    let dv = donvi.getDataValue("tendv");

    lv = lv
        .split(" ")
        .map((s) => s[0])
        .join(""); /// chuyen doi Giao Duc thanh GD

    dv = dv
        .split(" ")
        .map((s) => s[0])
        .join("");

    return `${stt}/${year}/${lv}-${dv}`;
}
