import React, { createRef } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import SEO from '../components/seo';

class Articles extends React.Component {
  constructor(props) {
      super(props);
      this.scriptRef = createRef();
  }

  componentDidMount() {
    debugger;
    const script = this.scriptRef.current
    window.eval(script);
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
        <script
          ref={this.scriptRef}
          src="https://trello.com/b/qo1G8apM.js"
        ></script>
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
