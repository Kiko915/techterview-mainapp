import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove script and style elements
        $('script').remove();
        $('style').remove();

        // Extract text
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        // Limit text length to avoid token limits (e.g., 10000 chars)
        const truncatedText = text.substring(0, 10000);

        return NextResponse.json({ text: truncatedText });
    } catch (error) {
        console.error("Scraping error:", error);
        return NextResponse.json(
            { error: "Failed to scrape URL" },
            { status: 500 }
        );
    }
}
