"use client";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const handleInputChange = async (e) => {
		try {
			const { value } = e.target;
			const response = await fetch("/api", {
				method: "POST",
				body: JSON.stringify({ query: value }),
			});
			const { results } = await response.json();
			setSuggestions(results);
		} catch (error) {
			console.error(error);
			alert("Something went wrong");
		}
	};

	return (
		<main className={styles.main}>
			<div className={styles.autocomplete}>
				<input
					type="text"
					className={styles.input}
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value);
						handleInputChange(e);
					}}
					placeholder="Type to search..."
				/>
				<ul>
					{suggestions.map((suggestion, index) => (
						<li className={styles.item} key={index}>
							<img
								src={`http://unsplash.it/100?random=${index}`}
								alt="Random Picture"
							/>
							<p> {suggestion.title}</p>
						</li>
					))}
				</ul>
			</div>
		</main>
	);
}
