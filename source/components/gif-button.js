import { useCallback, useState } from "react";
import { MdGif } from "react-icons/md";
import { browserRuntime } from "../browser-runtime";
import giphyLogo from "url:../giphy.png";
import GifThumbnail from "./gif-thumbnail";
import Loader from "./loader";

export const addGifInputId = "add-gif-input";
export const addGifButtonId = "add-gif-button";

const GifButton = ({ textarea }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [isShowingGifs, setIsShowingGifs] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [gifs, setGifs] = useState([]);
	const [debounceId, setDebounceId] = useState(null);

	const searchGiphy = useCallback((query) => {
		browserRuntime.sendMessage(
			{
				type: "gifSearch",
				data: query,
			},
			(response) => {
				setIsLoading(false);
				if (response.type === "gifResults") {
					setGifs(response.data);
				} else if (response.type === "error") {
					setErrorMessage(response.data);
				}
			},
		);
	}, []);

	const handleSearchChange = useCallback(
		(evt) => {
			clearTimeout(debounceId);
			setIsLoading(false);
			setErrorMessage(null);
			setSearchTerm(evt.target.value);
			if (evt.target.value.trim() !== "") {
				setIsLoading(true);
				setGifs([]);
				const id = setTimeout(() => searchGiphy(evt.target.value), 500);
				setDebounceId(id);
			}
		},
		[debounceId],
	);

	const appendGifMarkdown = useCallback(
		(gif) => {
			const gifUrl = gif.images.downsized_medium.url;
			const markdown = `![GIF](${gifUrl})`;
			textarea.value += markdown;
			textarea.dispatchEvent(new Event("input", { bubbles: true }));
		},
		[textarea],
	);

	return (
		<>
			<a
				id={addGifButtonId}
				className="Button--invisible Button--small Button"
				onClick={() => setIsShowingGifs(!isShowingGifs)}
			>
				<span className="Button-content">
					<span className="Button-visual Button-leadingVisual">
						<MdGif size="24" />
					</span>
					<span
						className="Button-label"
						style={{ color: "var(--fgColor-muted)" }}
					>
						Add GIF
					</span>
				</span>
			</a>
			<div
				className="border rounded"
				style={{
					height: "300px",
					overflowY: "auto",
					display: isShowingGifs ? "block" : "none",
					marginBottom: "8px",
				}}
			>
				<div
					style={{
						position: "sticky",
						top: 0,
						width: "100%",
						zIndex: 1,
						backgroundColor: "var(--bgColor-default)",
						borderBottom: "1px solid var(--control-borderColor-rest)",
						display: "flex",
						alignItems: "center",
					}}
				>
					<input
						id={addGifInputId}
						type="text"
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder="Search GIFs..."
						style={{
							position: "sticky",
							top: 0,
							width: "100%",
							zIndex: 1,
							backgroundColor: "transparent",
							border: "0",
							boxShadow: "var(--shadow-inset)",
							color: "var(--fgColor-default)",
							padding: "5px 12px",
							fontSize: "14px",
							lineHeight: "20px",
							outline: "none",
						}}
					/>
					<div
						style={{
							backgroundColor: "rgba(0,0,0,0.3)",
							alignSelf: "stretch",
							display: "flex",
							alignItems: "center",
						}}
					>
						<img
							src={giphyLogo}
							style={{
								height: "15px",
								filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
							}}
						/>
					</div>
				</div>
				{isLoading && (
					<div
						style={{
							marginTop: "8px",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Loader />
					</div>
				)}
				{errorMessage && (
					<div
						style={{
							backgroundColor: "var(--fgColor-danger)",
							color: "white",
							padding: "5px",
						}}
					>
						Error: {errorMessage}
					</div>
				)}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						gap: "8px",
						padding: "8px",
					}}
				>
					{gifs.map((gif) => (
						<GifThumbnail
							gif={gif}
							key={gif.id}
							onClick={() => appendGifMarkdown(gif)}
						/>
					))}
				</div>
			</div>
		</>
	);
};
export default GifButton;
