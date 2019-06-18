import React from 'react';
import { render } from 'react-dom';

import GifButton from './GifButton';
import Root from '../app/containers/Root';
import configureStore from '../app/store/configureStore';

import actionTypes from '../app/actions/gif-action-types';


const loadGifButtons = () => {
    const toolbars = document.querySelectorAll('.timeline-comment-wrapper .form-actions, .js-inline-comment-form .form-actions');
    const reviewMenu = document.querySelector('.pull-request-review-menu');
    let store;

    if (toolbars.length > 0 || reviewMenu !== null) {
        store = configureStore();
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
                        onChooseGif: () => {
                            const btns = bar.getElementsByClassName('btn');
                            for (let btn = 0; btn < btns.length; btn += 1) {
                                btns[btn].removeAttribute('disabled', false);
                            }
                        },
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
};

loadGifButtons();

document.querySelectorAll('.js-add-line-comment').forEach((element) => {
    element.addEventListener('click', () => {
        setTimeout(loadGifButtons, 0);
    });
});
