import React from 'react';
import { Link } from 'gatsby';

class Navigation extends React.Component {
    render() {
        const linkStyle = {
            display: 'inline-block',
            margin: '.5em',
            padding: '.2em'
        };

        const linkLabel = {
            padding: '0em',
            margin: '0em'
        };

        const navStyle = {
            paddingBottom: '2em'
        }

        return (
            <nav style={navStyle}>
                <Link style={linkStyle} to={'/'}>
                    <h4 style={linkLabel}>Blog</h4>
                </Link>
                <Link style={linkStyle} to={'/articles'}>
                    <h4 style={linkLabel}>Article Library</h4>
                </Link>
            </nav>
        )
    }
}

export default Navigation;