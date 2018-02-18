import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default () => {
    const enhancer = compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : nope => nope,
    );
    const store = createStore(rootReducer, enhancer);
    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers');
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
};
