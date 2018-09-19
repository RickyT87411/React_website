/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import {createLinkCommunity} from 'utils/createLink';
import {sectionListCommunity} from 'utils/sectionList';

const Community = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      createLink={createLinkCommunity}
      location={location}
      markdownRemark={data.markdownRemark}
      sectionList={sectionListCommunity}
      titlePostfix=" &ndash; React"
    />
  </Layout>
);

export const pageQuery = graphql`
  query TemplateCommunityMarkdown($slug: String!) {
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

export default Community;
