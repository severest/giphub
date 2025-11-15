import { useEffect, useState } from "react";

const GifThumbnail = ({ gif, onClick }) => {
	return (
		<img
			src={gif.blobUrl}
			alt="GIF"
			onClick={onClick}
			style={{
				width: "100%",
				height: "auto",
				cursor: "pointer",
			}}
		/>
	);
};

export default GifThumbnail;
