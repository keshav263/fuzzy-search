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
		let correctedQuery = lowercaseQuery;

		const synonymDictionary = {
			// PlayStation
			PlayStation: ["console", "ps", "sony"],
			xbox: ["xbox", "xbox one", "xbox series x", "xbox series s", "microsoft"],

			// Add more synonyms for other gaming consoles as needed
		};
		for (const key in synonymDictionary) {
			const synonyms = synonymDictionary[key];
			const similarityScores = synonyms.map((synonym) =>
				similarity.compareTwoStrings(lowercaseQuery, synonym)
			);

			// Find the maximum similarity score
			const maxSimilarity = Math.max(...similarityScores);

			if (maxSimilarity > 0.5) {
				correctedQuery = key;
				break;
			}
		}

		const fuse = new Fuse(products, {
			keys: ["title"],
			includeScore: true,
			threshold: 0.4,
		});

		const searchResults = fuse.search(correctedQuery);

		return NextResponse.json({
			success: true,
			results: searchResults.map((result) => result.item),
			message: "Here are your search results",
		});
	} catch (error) {
		return NextResponse.json({
			message: "Something went wrong",
		});
	}
}
