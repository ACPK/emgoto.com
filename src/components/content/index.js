import React from 'react';
import MDXRenderer from 'gatsby-plugin-mdx/mdx-renderer';
import kebabCase from 'lodash/kebabCase';
import { Link } from 'gatsby';
import GithubIcon from '../../images/icon-github';
import {
    Container,
    TagContainer,
    Interpunct,
    DateAndTags,
    IconContainer,
} from './styled';

const getGithubUrl = slug =>
    `https://github.com/emgoto/content/tree/master/posts/${slug}/index.md`;

const Tag = ({ tag }) => (
    <Link to={`/tags/${kebabCase(tag)}`}>
        <TagContainer>{tag}</TagContainer>
    </Link>
);

const GithubLink = ({ slug }) => (
    <>
        <Interpunct>·</Interpunct>{' '}
        <IconContainer>
            <a
                href={getGithubUrl(slug)}
                aria-labelledby="Edit this post"
            >
                <div>
                    <GithubIcon />
                    <span>Edit this post</span>
                </div>
            </a>
        </IconContainer>
    </>
);

const Content = ({ title, date, tags, body, slug }) => (
    <div>
        <h1>{title}</h1>
        <Container>
            <DateAndTags>
                {date}
                <Interpunct>·</Interpunct>{' '}
                {tags.map(tag => (
                    <Tag tag={tag} key={tag} />
                ))}
                <GithubLink slug={slug} />
            </DateAndTags>
        </Container>
        <MDXRenderer>{body}</MDXRenderer>
    </div>
);

export default Content;
