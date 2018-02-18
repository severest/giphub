import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { searchGifs } from '../actions/gifs';

import style from './search.css';

@connect(
    state => ({
        isVisible: state.gifs.frameVisible,
    }),
    dispatch => ({
        searchGifs: searchTerm => dispatch(searchGifs(searchTerm)),
    })
)
class Search extends React.Component {
    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        searchGifs: PropTypes.func.isRequired,
    }

    state = {
        searchTerm: '',
    }

    componentDidUpdate(prevProps) {
        if (this.props.isVisible && !prevProps.isVisible) {
            this.inputField.focus();
        }
    }

    handleSearchInputChange = (e) => {
        this.setState({
            searchTerm: e.target.value,
        });
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.searchGifs(this.state.searchTerm);
        }
    }

    inputField() {
        return this.inputField;
    }

    render() {
        return (
            <div className={style.container}>
                <input
                    type="text"
                    className={style.input}
                    value={this.state.searchTerm}
                    placeholder="Search..."
                    onChange={this.handleSearchInputChange}
                    onKeyPress={this.handleKeyPress}
                    ref={(input) => { this.inputField = input; }}
                />
            </div>
        );
    }
}

export default Search;
