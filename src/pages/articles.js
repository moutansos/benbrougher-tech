import React, { createRef } from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.articlesBoardRef = createRef();
  }

  componentDidMount() {
    window.TrelloBoards.create('https://trello.com/b/qo1G8apM', this.articlesBoardRef.current);
  }

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;

    // this.componentId = `script-tag-${Math.floor(Math.random() * 1000)}`;
    this.componentId = `script-tag`;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Articles" />
        <h1>Articles by Other Authors</h1>
        <p>
          Below is a link to my library of articles that I've read and kept. All manner of content is referenced here.
          From things like technical deep dives of compiler architecture to project management strategies. If I feel that
          it could be useful it's here.
        </p>
        <div ref={this.articlesBoardRef}></div>
      </Layout>
    );
  }
}

export default Articles;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
