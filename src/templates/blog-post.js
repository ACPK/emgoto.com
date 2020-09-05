import React from 'react';
import { graphql } from 'gatsby';
import Content from '../components/content';
import Seo from '../components/seo';
import Newsletter from '../components/newsletter';

export default ({ data }) => {
    const {
        mdx: {
            frontmatter: { title, date, tags },
            slug,
            body,
        },
    } = data;

    return (
        <>
            <Seo title={title} slug={slug} />
            <Content
                title={title}
                body={body}
                date={date}
                tags={tags}
                slug={slug}
            />
            <Newsletter />
        </>
    );
};

export const pageQuery = graphql`
    query($slug: String!) {
        mdx(slug: { eq: $slug }) {
            frontmatter {
                tags
                category
                date(formatString: "DD MMMM YYYY")
                title
                emoji
            }
            slug
            body
        }
    }
`;
