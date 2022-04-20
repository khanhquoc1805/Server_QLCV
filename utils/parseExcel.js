import xlsx from "xlsx";

export const parseExcel = (filename) => {
    const excelData = xlsx.readFile(filename, { cellDates: true });

    return Object.keys(excelData.Sheets).map((name) => ({
        name,
        data: xlsx.utils.sheet_to_json(excelData.Sheets[name]),
    }));
};
