import React from 'react';
import { graphql } from 'gatsby';
import Summaries from '../components/summaries';
import Seo from '../components/seo';

export default ({ data }) => {
    console.log('data', data);
    return  <>
    <h1>blog</h1>
    <Seo title={'Blog'} slug={'blog'} />
    <Summaries edges={data.allMdx.edges} />
</>
}

export const pageQuery = graphql`
    query {
        allMdx(
            limit: 2000
            sort: { fields: [frontmatter___date], order: DESC }
            filter: { frontmatter: { category: { ne: null } } }
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
