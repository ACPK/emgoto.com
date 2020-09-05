import React from 'react';
import IconTwitter from '../../../images/icon-twitter';
import IconDev from '../../../images/icon-dev';
import {
    Container,
    HeaderContainer,
    YellowContainer,
    Icons,
    Margin,
} from './styled';
import { Link } from 'gatsby';

const Header = () => (
    <Container>
        <HeaderContainer>
            <Link to="/">
                emma <YellowContainer>goto</YellowContainer>
            </Link>
        </HeaderContainer>
        <Icons>
            <Margin>
                <a
                    href="https://dev.to/emma"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconDev />
                </a>
            </Margin>
            <div>
                <a
                    href="https://twitter.com/emma_goto"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconTwitter />
                </a>
            </div>
        </Icons>
    </Container>
);

export default Header;
