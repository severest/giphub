import { browserRuntime } from "./browser-runtime.js";

const giphyApiUrl = (search, limit, offset) => {
	let url = `https://api.giphy.com/v1/gifs/search?q=${search}&limit=${limit}&api_key=${process.env.GIPHY_API}`;
	if (offset) {
		url += `&offset=${offset}`;
	}
	return url;
};

const convertToDataURL = async (url) => {
	const response = await fetch(url);
	const blob = await response.blob();
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
};

const fetchGiphy = async (query) => {
	const response = await fetch(giphyApiUrl(encodeURI(query), 20));
	if (response.status !== 200) {
		console.error(`Error fetching GIFs from Giphy API: ${response.statusText}`);
		return;
	}
	const giphyResponse = await response.json();

	return await Promise.all(
		giphyResponse.data.map(async (item) => ({
			...item,
			blobUrl: await convertToDataURL(item.images.downsized.url),
		})),
	);
};

browserRuntime.onMessage.addListener((message, sender, sendResponse) => {
	if (message?.gifSearchQuery) {
		fetchGiphy(message.gifSearchQuery)
			.then((data) => {
				console.log({ data });
				// Make sure you're sending the actual data from fetchGiphy
				return sendResponse(data);
			})
			.catch((error) => {
				return sendResponse(error.message);
			});
		return true;
	}
});
