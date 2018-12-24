import actionTypes from '../actions/gif-action-types';

const initialState = {
    gifs: [],
    searchInProgress: false,
    searchError: false,
    lastSearchTerm: '',
    morePages: false,
    moreRequestInProgress: false,
    searchOffset: 0,
    searchLimit: 15,
    frameVisible: false,
    textarea: null,
    onChooseGif: () => {},
};

const actionsMap = {
    [actionTypes.TOGGLE_FRAME]: state => ({
        ...state,
        frameVisible: !state.frameVisible,
    }),
    [actionTypes.SEARCH_GIF]: (state, action) => ({
        ...state,
        searchInProgress: true,
        searchError: false,
        lastSearchTerm: action.payload,
        searchOffset: 0,
    }),
    [actionTypes.SEARCH_ERROR]: state => ({
        ...state,
        searchInProgress: false,
        searchError: true,
    }),
    [actionTypes.RECEIVE_GIF]: (state, action) => ({
        ...state,
        searchInProgress: false,
        gifs: action.payload,
        searchOffset: state.searchLimit,
    }),
    [actionTypes.FETCH_MORE_GIF]: state => ({
        ...state,
        searchOffset: state.searchOffset + state.searchLimit,
        moreRequestInProgress: true,
    }),
    [actionTypes.RECEIVE_MORE_GIF]: (state, action) => ({
        ...state,
        gifs: state.gifs.concat(action.payload),
        moreRequestInProgress: false,
    }),
    [actionTypes.SET_TEXTAREA]: (state, action) => ({
        ...state,
        textarea: action.payload.area,
        onChooseGif: action.payload.onChooseGif,
    }),
    [actionTypes.HAS_MORE_PAGES]: (state, action) => ({
        ...state,
        morePages: action.payload,
    }),
};

export default function todos(state = initialState, action) {
    const reduceFn = actionsMap[action.type];
    if (!reduceFn) return state;
    return reduceFn(state, action);
}
