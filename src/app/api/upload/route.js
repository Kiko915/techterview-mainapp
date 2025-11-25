import { NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const pdfParser = new PDFParser(null, 1); // 1 = text content only

        const text = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                try {
                    console.log("PDF Data Pages:", pdfData.Pages.length);
                    if (pdfData.Pages.length > 0) {
                        console.log("First Page Texts Length:", pdfData.Pages[0].Texts.length);
                        if (pdfData.Pages[0].Texts.length > 0) {
                            console.log("First Text Item:", JSON.stringify(pdfData.Pages[0].Texts[0], null, 2));
                        }
                    }

                    const rawText = pdfData.Pages.map(page =>
                        page.Texts.map(t =>
                            decodeURIComponent(t.R[0].T)
                        ).join(" ")
                    ).join("\n");

                    console.log("Extracted Text Length:", rawText.length);
                    console.log("Extracted Text Preview:", rawText.substring(0, 100));

                    resolve(rawText);
                } catch (e) {
                    console.error("Extraction Error:", e);
                    reject(e);
                }
            });
            pdfParser.parseBuffer(buffer);
        });

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json(
            { error: "Failed to parse PDF" },
            { status: 500 }
        );
    }
}
