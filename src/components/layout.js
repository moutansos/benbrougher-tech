import React from 'react';

import styleValues from '../style-values';
import Navigation from './navigation';

class Layout extends React.Component {
  render() {
    const { location, title, children, dontRenderFooter } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;
    let header;

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: 0,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: styleValues.primaryAccent,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      );
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
            color: styleValues.primaryAccent,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      );
    }
    return (
      <div
        style={{
          backgroundColor: styleValues.primaryBackground,
          color: styleValues.primaryText,
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(30),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <header>
            {header}
            <Navigation
              style={{
                marginBottom: rhythm(1.5),
              }}
            ></Navigation>
          </header>
          <main>{children}</main>
          {!dontRenderFooter && (
            <footer>
              © {new Date().getFullYear()}, Built with
              {` `}
              <a href="https://www.gatsbyjs.org">Gatsby</a><br />
              <a href="https://benbrougher.tech/rss.xml">RSS Feed</a>
            </footer>
          )}
        </div>
      </div>
    );
  }
}

export default Layout;
