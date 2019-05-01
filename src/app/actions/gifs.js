import actionTypes from './gif-action-types';

const giphyApiUrl = (search, limit, offset) => {
    let url = `https://api.giphy.com/v1/gifs/search?q=${search}&limit=${limit}&api_key=${GIPHY_API}`;
    if (offset) {
        url += `&offset=${offset}`;
    }
    return url;
};

export const searchGifs = searchTerm => (dispatch, getState) => {
    dispatch({ type: actionTypes.SEARCH_GIF, payload: searchTerm });
    const limit = getState().gifs.searchLimit;
    return fetch(giphyApiUrl(encodeURI(searchTerm), limit))
        .then((res) => {
            if (res.status !== 200) {
                dispatch({ type: actionTypes.SEARCH_ERROR });
            }
            res.json().then(({ data, meta, pagination }) => {
                if (meta.status !== 200) {
                    dispatch({ type: actionTypes.SEARCH_ERROR });
                }

                if (pagination.total_count > pagination.count) {
                    dispatch({ type: actionTypes.HAS_MORE_PAGES, payload: true });
                }

                dispatch({
                    type: actionTypes.RECEIVE_GIF,
                    payload: data,
                });
            });
        })
        .catch(() => dispatch({ type: actionTypes.SEARCH_ERROR }));
};

export const loadMore = () => (dispatch, getState) => {
    const { lastSearchTerm, morePages, moreRequestInProgress } = getState().gifs;
    if (morePages && !moreRequestInProgress) {
        dispatch({ type: actionTypes.FETCH_MORE_GIF });
        const offset = getState().gifs.searchOffset;
        const limit = getState().gifs.searchLimit;
        const currentGifs = getState().gifs.gifs;
        return fetch(giphyApiUrl(encodeURI(lastSearchTerm), limit, offset))
            .then((res) => {
                if (res.status !== 200) {
                    dispatch({ type: actionTypes.SEARCH_ERROR });
                }
                res.json().then(({ data, meta, pagination }) => {
                    if (meta.status !== 200) {
                        dispatch({ type: actionTypes.SEARCH_ERROR });
                    }

                    if (pagination.total_count > pagination.count + currentGifs.length) {
                        dispatch({ type: actionTypes.HAS_MORE_PAGES, payload: true });
                    } else {
                        dispatch({ type: actionTypes.HAS_MORE_PAGES, payload: false });
                    }

                    dispatch({
                        type: actionTypes.RECEIVE_MORE_GIF,
                        payload: data,
                    });
                });
            })
            .catch(() => dispatch({ type: actionTypes.SEARCH_ERROR }));
    }
};

export const toggleFrame = () => ({
    type: actionTypes.TOGGLE_FRAME,
});
