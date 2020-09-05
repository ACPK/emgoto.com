import React from 'react';
import { graphql } from 'gatsby';
import Summaries from '../components/summaries';
import Seo from '../components/seo';

export default ({ pageContext, data }) => {
    const { tag } = pageContext || {};
    return (
        <>
            <h1>{`#${tag}`}</h1>
            <Seo title={`#${tag}`} slug={tag} />
            <Summaries edges={data.allMdx.edges} />
        </>
    );
};

export const pageQuery = graphql`
    query($tag: String) {
        allMdx(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { tags: { in: [$tag] } } }
        ) {
            totalCount
            edges {
                node {
                    frontmatter {
                        title
                        category
                        tags
                        emoji
                        date(formatString: "DD MMMM YYYY")
                    }
                    slug
                }
            }
        }
    }
`;
