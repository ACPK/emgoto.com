import React from 'react';
import { Link } from 'gatsby';
import Seo from '../components/seo';

const PageNotFound = () => (
    <p>
        <Seo />
        <Link to="/">Head back home.</Link>
    </p>
);

export default PageNotFound;
