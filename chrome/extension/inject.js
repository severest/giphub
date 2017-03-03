import React, { Component } from 'react';
import { render } from 'react-dom';

import Root from '../../app/containers/Root';

import actionTypes from '../../app/actions/gif-action-types';

class GifButton extends Component {
    static propTypes = {
        handleGifClick: React.PropTypes.func.isRequired,
    }

    render() {
        return (
            <button
                type="button"
                className="toolbar-item"
                onClick={this.props.handleGifClick}
            >
                GIF
            </button>
        );
    }
}

const toolbars = document.getElementsByClassName('js-toolbar');
const reviewMenu = document.querySelector('.pull-request-review-menu');
let store;

if (toolbars.length > 0 || reviewMenu !== null) {
    const createStore = require('../../app/store/configureStore');
    store = createStore();
    const frameDOM = document.createElement('div');
    document.body.appendChild(frameDOM);
    render(
        <Root store={store} />,
        frameDOM
    );
}

for (let i = 0; i < toolbars.length; i++) {
    const previousBtns = toolbars[i].getElementsByClassName('gif-toolbar');
    for (let btn = 0; btn < previousBtns.length; btn++) {
        previousBtns[btn].remove();
    }

    const injectDOM = document.createElement('div');
    injectDOM.className = 'toolbar-group gif-toolbar';
    toolbars[i].appendChild(injectDOM);
    render(<GifButton
        handleGifClick={() => {
            const bar = toolbars[i];
            const area = bar.parentNode.parentNode.getElementsByClassName('comment-form-textarea')[0];
            store.dispatch({
                type: actionTypes.SET_TEXTAREA,
                payload: {
                    area,
                    onChooseGif: () => {},
                },
            });
            store.dispatch({ type: actionTypes.TOGGLE_FRAME });
        }}
    />, injectDOM);
}


if (reviewMenu !== null) {
    const previousBtns = reviewMenu.getElementsByClassName('gif-toolbar');
    for (let btn = 0; btn < previousBtns.length; btn++) {
        previousBtns[btn].remove();
    }

    const injectDOM = document.createElement('div');
    injectDOM.className = 'gif-toolbar';
    reviewMenu.getElementsByClassName('form-actions')[0].prepend(injectDOM);
    render(<GifButton
        handleGifClick={() => {
            const area = reviewMenu.getElementsByClassName('comment-form-textarea')[0];
            store.dispatch({
                type: actionTypes.SET_TEXTAREA,
                payload: {
                    area,
                    onChooseGif: () => {
                        document.querySelector('.js-reviews-container').classList += ' active';
                        area.focus();
                    },
                },
            });
            store.dispatch({ type: actionTypes.TOGGLE_FRAME });
        }}
    />, injectDOM);
}
