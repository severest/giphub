import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';

import Root from '../../app/containers/Root';

import actionTypes from '../../app/actions/gif-action-types';

class GifButton extends Component {
    static propTypes = {
        className: PropTypes.string.isRequired,
        handleGifClick: PropTypes.func.isRequired,
    }

    render() {
        return (
            <button
                type="button"
                className={this.props.className}
                onClick={this.props.handleGifClick}
                style={{marginRight: '5px'}}
            >
                GIF
            </button>
        );
    }
}


const toolbars = document.querySelectorAll('.timeline-comment-wrapper .form-actions');
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

for (let i = 0; i < toolbars.length; i += 1) {
    const previousBtns = toolbars[i].getElementsByClassName('gif-toolbar');
    for (let btn = 0; btn < previousBtns.length; btn += 1) {
        previousBtns[btn].remove();
    }

    const injectDOM = document.createElement('span');
    injectDOM.className = 'gif-toolbar';
    toolbars[i].appendChild(injectDOM);
    render(<GifButton
        className="btn"
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
    for (let btn = 0; btn < previousBtns.length; btn += 1) {
        previousBtns[btn].remove();
    }

    const injectDOM = document.createElement('div');
    injectDOM.className = 'gif-toolbar';
    reviewMenu.getElementsByClassName('form-actions')[0].prepend(injectDOM);
    render(<GifButton
        className="toolbar-item"
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
