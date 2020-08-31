import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dock from 'react-dock';

import Header from '../components/header';
import Search from '../components/search';
import Loader from '../components/loader';

import { toggleFrame, loadMore } from '../actions/gifs';

import style from './App.css';

class App extends Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        gifs: PropTypes.array,
        searchInProgress: PropTypes.bool.isRequired,
        searchError: PropTypes.bool.isRequired,
        textarea: PropTypes.object,
        closeDock: PropTypes.func.isRequired,
        loadMore: PropTypes.func.isRequired,
        onChooseGif: PropTypes.func.isRequired,
    }

    static defaultProps = {
        gifs: null,
    }

    getGifs() {
        return this.props.gifs && this.props.gifs.map(g => (
            <button
                key={g.id}
                onClick={() => this.insertTextAtCursor(g.images.downsized_medium.url)}
            >
                <img
                    alt="gif"
                    src={g.images.downsized_medium.url}
                />
            </button>
        ));
    }

    getContent() {
        if (this.props.searchError) {
            return (
                <div className={style.error}>
                    Oops, there was a problem with the search. Please try again.
                </div>
            );
        }
        if (this.props.searchInProgress) {
            return <Loader />;
        }
        if (this.props.gifs !== null && this.props.gifs.length === 0) {
            return (
                <div className={style.error}>
                    😢 No results
                </div>
            )
        }
        return (
            <div className={style.gifs} onScroll={this.handleInfiniteScroll}>
                {this.getGifs()}
            </div>
        );
    }

    handleInfiniteScroll = (e) => {
        const loadMoreThreshold = 150;
        const scrollDiff = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop;
        if (scrollDiff < loadMoreThreshold) {
            this.props.loadMore();
        }
    }

    insertTextAtCursor = (gifURL) => {
        const text = `![giphub](${gifURL})`;
        const endIndex = this.props.textarea.selectionEnd;
        this.props.textarea.value = this.props.textarea.value.slice(
            0,
            this.props.textarea.selectionStart
        ) + text + this.props.textarea.value.slice(endIndex);
        this.props.textarea.selectionStart = endIndex + text.length;
        this.props.textarea.selectionEnd = this.props.textarea.selectionStart;
        this.props.closeDock();
        this.props.onChooseGif();
    }

    render() {
        return (
            <Dock
                position="right"
                defaultSize={0.4}
                isVisible={this.props.isVisible}
            >
                <div className={style.container}>
                    <Header />
                    <Search />

                    {this.getContent()}
                </div>
            </Dock>
        );
    }
}

export default connect(
    state => ({
        isVisible: state.gifs.frameVisible,
        gifs: state.gifs.gifs,
        searchInProgress: state.gifs.searchInProgress,
        searchError: state.gifs.searchError,
        textarea: state.gifs.textarea,
        onChooseGif: state.gifs.onChooseGif,
    }),
    dispatch => ({
        closeDock: () => dispatch(toggleFrame()),
        loadMore: () => dispatch(loadMore()),
    })
)(App);
