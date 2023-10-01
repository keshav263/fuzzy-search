import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Fuzzy Search with Next.js and Fuse.js",
	description:
		"Learn how to build a fuzzy search feature with Next.js and Fuse.js",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
