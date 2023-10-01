import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import products from "@/app/data/products";
import similarity from "string-similarity";

export async function GET(req, res) {
	try {
		return NextResponse.json({
			success: true,
			message: "Here are your search results",
		});
	} catch (error) {
		return NextResponse.error({
			status: 500,
			message: "Something went wrong",
		});
	}
}

export async function POST(request) {
	try {
		const { query } = await request.json();

		const lowercaseQuery = query.toLowerCase();
		const synonymDictionary = {
			playstation: ["console", "ps", "sony"],
			xbox: [
				"xbox",
				"xbox one",
				"xbox series x",
				"xbox series s",
				"microsoft",
				"console",
			],
			refrigerator: ["fridge", "freezer"],
			television: [
				"led",
				"tv",
				"4k",
				"8k",
				"oled",
				"smart tv",
				"samsung",
				"lg",
				"sony",
			],
		};

		const matchingKeywords = [];

		for (const key in synonymDictionary) {
			const synonyms = synonymDictionary[key];
			const similarityScores = synonyms.map((synonym) =>
				similarity.compareTwoStrings(lowercaseQuery, synonym)
			);

			// Find the maximum similarity score
			const maxSimilarity = Math.max(...similarityScores);

			if (maxSimilarity > 0.5) {
				matchingKeywords.push(key);
			}
		}

		const fuse = new Fuse(products, {
			keys: ["title"],
			includeScore: true,
			threshold: 0.4,
		});

		const searchResults = [];

		// Add matching synonyms to the search results
		matchingKeywords.forEach((keyword) => {
			const synonymResults = fuse.search(keyword);
			searchResults.push(...synonymResults);
		});

		const filteredResults = searchResults.map((result) => result.item);

		return NextResponse.json({
			success: true,
			results: filteredResults,
			message: "Here are your search results",
		});
	} catch (error) {
		return NextResponse.json({
			message: "Something went wrong",
		});
	}
}
