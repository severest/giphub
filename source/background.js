import {browserRuntime} from './browser-runtime.js';

const giphyApiUrl = (search, limit, offset) => {
  let url = `https://api.giphy.com/v1/gifs/search?q=${search}&limit=${limit}&api_key=${process.env.GIPHY_API}`; // eslint-disable-line n/prefer-global/process
  if (offset) {
    url += `&offset=${offset}`;
  }

  return url;
};

const convertToDataURL = async url => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const fetchGiphy = async (query, offset = 0) => {
  const response = await fetch(giphyApiUrl(encodeURI(query), 21, offset));
  if (response.status !== 200) {
    throw new Error(
      `Error fetching GIFs from Giphy API: ${response.statusText}`,
    );
  }

  const giphyResponse = await response.json();

  const data = await Promise.all(
    giphyResponse.data.map(async item => ({
      ...item,
      blobUrl: await convertToDataURL(item.images.downsized.url),
    })),
  );

  const hasMore = giphyResponse.pagination.offset + giphyResponse.pagination.count < giphyResponse.pagination.total_count;

  return {
    data,
    hasMore,
  };
};

browserRuntime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'gifSearch') {
    fetchGiphy(message.data.query, message.data.offset)
      .then(result => sendResponse({type: 'gifResults', data: result.data, hasMore: result.hasMore}))
      .catch(error => sendResponse({type: 'error', data: error.message}));
    return true;
  }
});
