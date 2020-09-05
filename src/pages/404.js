import React from 'react';
import { Link } from 'gatsby';
import Seo from '../components/seo';

const PageNotFound = () => (
    <p>
        <Seo title="404" />
        <Link to="/">Head back home.</Link>
    </p>
);

export default PageNotFound;
