import React, { Component } from 'react';
import PropTypes from 'prop-types';


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
                style={{ marginRight: '5px' }}
            >
                GIF
            </button>
        );
    }
}

export default GifButton;
