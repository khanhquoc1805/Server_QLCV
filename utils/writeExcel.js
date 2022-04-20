import xl from "excel4node";

export function writeExcel(array) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Sheet 1");
    var style = wb.createStyle({
        font: {
            color: "#FF0800",
            size: 12,
        },
        numberFormat: "$#,##0.00; ($#,##0.00); -",
    });
    var style1 = wb.createStyle({
        font: {
            color: "#000000",
            size: 12,
        },
        numberFormat: "$#,##0.00; ($#,##0.00); -",
    });
    ws.cell(1, 1).string("Tài khoản").style(style);
    ws.cell(1, 2).string("Mật Khẩu").style(style);
    ws.cell(1, 3).string("Tên Cán bộ").style(style);
    ws.cell(1, 4).string("email").style(style);
    ws.cell(1, 5).string("Đơn vị").style(style);

    for (const [index, value] of array.entries()) {
        ws.cell(index + 2, 1)
            .string(value.taikhoan)
            .style(style1);
        ws.cell(index + 2, 2)
            .string(value.matkhau)
            .style(style1);
        ws.cell(index + 2, 3)
            .string(value.tennv)
            .style(style1);
        ws.cell(index + 2, 4)
            .string(value.email)
            .style(style1);
        ws.cell(index + 2, 5)
            .string(value.donvi)
            .style(style1);
    }

    wb.write(`${process.cwd()}/private/file/result.xlsx`);
}
