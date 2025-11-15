import { useCallback, useState } from "react";
import { MdGif } from "react-icons/md";
import { browserRuntime } from "../browser-runtime";
import giphyLogo from "../giphy.png";
import GifThumbnail from "./gif-thumbnail";

export const addGifInputId = "add-gif-input";
export const addGifButtonId = "add-gif-button";

const GifButton = ({ textarea }) => {
	const [isShowingGifs, setIsShowingGifs] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [gifs, setGifs] = useState([]);
	const [debounceId, setDebounceId] = useState(null);

	const searchGiphy = useCallback((query) => {
		browserRuntime.sendMessage(
			{
				gifSearchQuery: query,
			},
			(response) => {
				console.log("Search message response:", response);
				setGifs(response ?? []);
			},
		);
	}, []);

	const handleSearchChange = useCallback(
		(evt) => {
			clearTimeout(debounceId);
			setSearchTerm(evt.target.value);
			if (evt.target.value.trim() !== "") {
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
					<img src={giphyLogo} style={{ height: "15px" }} />
				</div>
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
