import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default () => {
    const enhancer = compose(
        applyMiddleware(thunk),
    );
    return createStore(rootReducer, enhancer);
};
