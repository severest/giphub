import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

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
