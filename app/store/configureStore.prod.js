import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default () => {
    const enhancer = compose(applyMiddleware(thunk));
    return createStore(rootReducer, enhancer);
};
