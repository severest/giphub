import React from "react";
import { render } from "react-dom";

import GifButton from "./GifButton";
import Root from "../app/containers/Root";
import configureStore from "../app/store/configureStore";

import actionTypes from "../app/actions/gif-action-types";
import { toggleFrame } from "../app/actions/gifs";

let store;

const createGifButton = (element, textarea, prepend = false) => {
    const previousBtns = element.getElementsByClassName("gif-toolbar");
    for (let btn = 0; btn < previousBtns.length; btn += 1) {
        previousBtns[btn].remove();
    }

    const injectDOM = document.createElement("span");
    injectDOM.className = "gif-toolbar";
    if (prepend) {
        element.prepend(injectDOM);
    } else {
        element.appendChild(injectDOM);
    }
    render(
        <GifButton
            className="btn"
            handleGifClick={() => {
                const bar = element;
                const area = textarea;
                store.dispatch({
                    type: actionTypes.SET_TEXTAREA,
                    payload: {
                        area,
                        onChooseGif: () => {
                            const btns = bar.getElementsByClassName("btn");
                            for (let btn = 0; btn < btns.length; btn += 1) {
                                btns[btn].removeAttribute("disabled", false);
                            }
                        },
                        onClose: () => {},
                    },
                });
                store.dispatch(toggleFrame());
            }}
        />,
        injectDOM
    );
};

const loadGifButtons = () => {
    const commentBoxes = document.querySelectorAll(
        ".timeline-comment-wrapper .js-new-comment-form .flex-justify-end"
    );
    const inlineComments = document.querySelectorAll(
        ".js-inline-comment-form .form-actions"
    );
    const reviewMenu = document.querySelector("#review-changes-modal");

    if (
        commentBoxes.length > 0 ||
        inlineComments.length > 0 ||
        reviewMenu !== null
    ) {
        store = configureStore();
        const frameDOM = document.createElement("div");
        document.body.appendChild(frameDOM);
        render(<Root store={store} />, frameDOM);
    }

    for (let i = 0; i < commentBoxes.length; i += 1) {
        createGifButton(
            commentBoxes[i],
            commentBoxes[
                i
            ].parentNode.parentNode.parentNode.getElementsByClassName(
                "FormControl-textarea"
            )[0],
            true
        );
    }

    for (let i = 0; i < inlineComments.length; i += 1) {
        createGifButton(
            inlineComments[i],
            inlineComments[i].parentNode.parentNode.getElementsByClassName(
                "FormControl-textarea"
            )[0],
            false
        );
    }

    if (reviewMenu !== null) {
        const previousBtns = reviewMenu.getElementsByClassName("gif-toolbar");
        for (let btn = 0; btn < previousBtns.length; btn += 1) {
            previousBtns[btn].remove();
        }

        const injectDOM = document.createElement("div");
        injectDOM.className = "gif-toolbar";
        reviewMenu
            .getElementsByClassName("Overlay-footer")[1]
            .prepend(injectDOM);
        render(
            <GifButton
                className="btn btn-sm float-left"
                handleGifClick={() => {
                    const area = reviewMenu.getElementsByClassName(
                        "FormControl-textarea"
                    )[0];
                    store.dispatch({
                        type: actionTypes.SET_TEXTAREA,
                        payload: {
                            area,
                            onChooseGif: () => {
                                area.focus();
                            },
                            onClose: () => {},
                        },
                    });
                    store.dispatch(toggleFrame());
                }}
            />,
            injectDOM
        );
    }
};

loadGifButtons();

setTimeout(() => {
    document.querySelectorAll(".js-add-line-comment").forEach((element) => {
        element.addEventListener("click", () => {
            setTimeout(loadGifButtons, 0);
        });
    });
}, 1000);

document.addEventListener("keyup", (event) => {
    if (event.defaultPrevented || !store) {
        return;
    }
    const { frameVisible } = store.getState().gifs;
    if (!frameVisible) {
        return;
    }
    const key = event.key || event.keyCode;
    if (key === "Escape" || key === "Esc" || key === 27) {
        store.dispatch(toggleFrame());
    }
});
