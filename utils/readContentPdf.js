
import fs from "fs";
import pdf from "pdf-parse"

export async function readContentPDF(path) {
    const dataBuffer = fs.readFileSync(path);
    const content = await pdf(dataBuffer);
    console.log(content)
    return content.text;
}
