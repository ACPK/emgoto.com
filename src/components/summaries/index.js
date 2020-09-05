import React from 'react';
import { Link } from 'gatsby';
import { Button, Emoji, Title, Date } from './styled';

export const CURRENT_YEAR = '2020';

const renderDateWithoutCurrentYear = dateWithYear =>
    dateWithYear.split(` ${CURRENT_YEAR}`)[0];

const Summary = ({ slug, frontmatter: { title, emoji, date } }) => 
    <Link to={`/${slug}`}>
    <Button>
        <Emoji>{emoji}</Emoji>
        <div>
            <Title>{title}</Title>
            <Date>{renderDateWithoutCurrentYear(date)}</Date>
        </div>
    </Button>
</Link>

export default ({ edges }) =>
    edges.map((edge, i) => {
        const { frontmatter, slug } = edge.node;
        return (
            <Summary slug={slug} key={i} frontmatter={frontmatter} />
        );
    });
