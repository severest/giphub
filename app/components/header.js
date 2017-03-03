import React from 'react';
import { connect } from 'react-redux';

import { toggleFrame } from '../actions/gifs';

import style from './header.css';
import giphy from '../images/giphy.png';
import giphub from '../images/giphub.png';

@connect(
    null,
    dispatch => ({
        closeDock: () => dispatch(toggleFrame()),
    })
)
class Header extends React.Component {
    static propTypes = {
        closeDock: React.PropTypes.func.isRequired,
    }

    render() {
        return (
            <div className={style.header}>
                <img className={style.icon} alt="Giphub" src={giphub} />
                <img className={style.powered} alt="Powered by Giphy" src={giphy} />
                <button onClick={() => this.props.closeDock()}>
                    Close
                </button>
            </div>
        );
    }
}

export default Header;
