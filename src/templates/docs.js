/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import {createLinkDocs} from 'utils/createLink';
import {sectionListDocs} from 'utils/sectionList';

const Docs = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      createLink={createLinkDocs}
      location={location}
      markdownRemark={data.markdownRemark}
      sectionList={sectionListDocs}
      titlePostfix=" &ndash; React"
    />
  </Layout>
);

Docs.propTypes = {
  data: PropTypes.object.isRequired,
};

export const pageQuery = graphql`
  query TemplateDocsMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        next
        prev
      }
      fields {
        path {
          id
        }
        slug
      }
    }
  }
`;

export default Docs;
