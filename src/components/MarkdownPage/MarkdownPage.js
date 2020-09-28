/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Flex from 'components/Flex';
import MarkdownHeader from 'components/MarkdownHeader';
import NavigationFooter from 'templates/components/NavigationFooter';
// $FlowFixMe Update Flow
import React, {useContext} from 'react';
import {BannerContext} from 'components/Banner';
import StickyResponsiveSidebar from 'components/StickyResponsiveSidebar';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import FeedbackForm from 'components/FeedbackForm';
import findSectionForPath from 'utils/findSectionForPath';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';
import {sharedStyles} from 'theme';
import createCanonicalUrl from 'utils/createCanonicalUrl';
import {colors} from 'theme';

import type {Node} from 'types';

type Props = {
  authors: Array<string>,
  createLink: Function, // TODO: Add better flow type once we Flow-type createLink
  date?: string,
  enableScrollSync?: boolean,
  ogDescription: string,
  location: Location,
  markdownRemark: Node,
  sectionList: Array<Object>, // TODO: Add better flow type once we have the Section component
  titlePostfix: string,
};

const getPageById = (sectionList: Array<Object>, templateFile: ?string) => {
  if (!templateFile) {
    return null;
  }

  const sectionItems = sectionList.map(section => section.items);
  const flattenedSectionItems = [].concat.apply([], sectionItems);
  const linkId = templateFile.replace('.html', '');

  return flattenedSectionItems.find(item => item.id === linkId);
};

const MarkdownPage = ({
  authors = [],
  createLink,
  date,
  enableScrollSync,
  ogDescription,
  location,
  markdownRemark,
  sectionList,
  titlePostfix = '',
}: Props) => {
  const {banner} = useContext(BannerContext);
  const hasAuthors = authors.length > 0;
  const titlePrefix = markdownRemark.frontmatter.title || '';

  const prev = getPageById(sectionList, markdownRemark.frontmatter.prev);
  const next = getPageById(sectionList, markdownRemark.frontmatter.next);

  return (
    <Flex
      direction="column"
      grow="1"
      shrink="0"
      halign="stretch"
      css={{
        width: '100%',
        flex: '1 0 auto',
        position: 'relative',
        zIndex: 0,
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          scrollMarginTop: banner ? banner.normalHeight : 0,
        },
      }}>
      <TitleAndMetaTags
        ogDescription={ogDescription}
        ogType="article"
        canonicalUrl={createCanonicalUrl(markdownRemark.fields.slug)}
        title={`${titlePrefix}${titlePostfix}`}
      />
      <div css={{flex: '1 0 auto'}}>
        <Container>
          <div css={sharedStyles.articleLayout.container}>
            <Flex type="article" direction="column" grow="1" halign="stretch">
              <MarkdownHeader title={titlePrefix} />

              {(date || hasAuthors) && (
                <div css={{marginTop: 15}}>
                  {date}{' '}
                  {hasAuthors && (
                    <span>
                      by{' '}
                      {toCommaSeparatedList(authors, author => (
                        <a
                          css={sharedStyles.link}
                          href={author.frontmatter.url}
                          key={author.frontmatter.name}>
                          {author.frontmatter.name}
                        </a>
                      ))}
                    </span>
                  )}
                </div>
              )}

              {hasAuthors && date && new Date(date).getFullYear() >= 2020 && (
                <div
                  style={{
                    fontSize: '80%',
                    marginTop: '2em',
                    padding: '10px 15px',
                    lineHeight: '1.5',
                    background: 'rgba(255,229,100,0.3)',
                  }}>
                  日本語版サイト (ja.reactjs.org)
                  のブログセクションへの記事掲載には
                  <a css={sharedStyles.link} href="https://reactjs.org/blog">
                    英語版サイト
                  </a>
                  と比べてタイムラグがあります。
                  最新のブログ記事は英語版でご確認ください。
                  <br />
                  日本語版サイトでは英語版ブログに定期的に追従しつつ、2020
                  年以降の記事を随時翻訳しています。
                </div>
              )}

              <div css={sharedStyles.articleLayout.content}>
                <div
                  css={[sharedStyles.markdown]}
                  dangerouslySetInnerHTML={{__html: markdownRemark.html}}
                />

                {markdownRemark.fields.path && (
                  <div css={{marginTop: 80}}>
                    <span
                      css={{
                        whiteSpace: 'nowrap',
                        paddingBottom: '1em',
                        marginRight: '36px',
                        display: 'inline-block',
                        color: colors.subtle,
                      }}>
                      <FeedbackForm />
                    </span>
                    <a
                      css={sharedStyles.articleLayout.editLink}
                      href={`https://github.com/reactjs/ja.reactjs.org/tree/master/${markdownRemark.fields.path}`}>
                      このページを編集する
                    </a>
                  </div>
                )}
              </div>
            </Flex>

            <div css={sharedStyles.articleLayout.sidebar}>
              <StickyResponsiveSidebar
                enableScrollSync={enableScrollSync}
                createLink={createLink}
                defaultActiveSection={findSectionForPath(
                  location.pathname,
                  sectionList,
                )}
                location={location}
                sectionList={sectionList}
              />
            </div>
          </div>
        </Container>
      </div>

      {(next || prev) && (
        <NavigationFooter location={location} next={next} prev={prev} />
      )}
    </Flex>
  );
};

export default MarkdownPage;
