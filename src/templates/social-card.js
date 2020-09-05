import React from 'react';
import styled from 'styled-components';
import colors from '../common';
import TerminalBar from '../components/terminal-bar';

const TWITTER_HEIGHT = 418;
const TWITTER_WIDTH = 800;

const DEV_HEIGHT = 420;
const DEV_WIDTH = 1000;

const Container = styled.div`
    width: ${props =>
        props.isTwitter ? TWITTER_WIDTH : DEV_WIDTH}px;
    height: ${props =>
        props.isTwitter ? TWITTER_HEIGHT : DEV_HEIGHT}px;
    padding: 0 ${props => (props.isTwitter ? 48 : 148)}px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    ${props =>
        props.image && `background-image: url(${props.image})`};
    background-size: ${props =>
        props.isTwitter ? TWITTER_WIDTH : DEV_WIDTH}px;
    background-position: bottom;

    &:before {
        background: rgba(32, 41, 51, 0.8);
        position: absolute;
        content: '';
        width: 1000px;
        height: 500px;
        bottom: 0;
        left: 0;
        top: 0;
        z-index: 0;
    }
`;

export const SquareContainer = styled.div`
    z-index: 1;
    box-sizing: border-box;
    background-color: ${colors.black};
    border-radius: 4px 4px 0 0;
`;

const Header = styled.div`
    flex-grow: 1;
    display: flex;
    align-content: center;
    padding: 48px 24px;
`;

const Emoji = styled.div`
    font-size: 60px;
    padding-right: 16px;
    align-self: center;
`;

const Title = styled.h1`
    letter-spacing: 1px;
    font-size: 48px;
    align-self: center;
    margin-bottom: -4px;
    line-height: 56px;
`;

const Grow = styled.div`
    flex-grow: 1;
`;

const SocialCard = ({
    pageContext: { isTwitter, title, emoji, coverImage },
}) => <Container isTwitter={isTwitter} image={coverImage}>
        <Grow />
        <SquareContainer>
            <TerminalBar scale={1.5} />
            <Header>
                <Emoji>{emoji}</Emoji>
                <Title>{title}</Title>
            </Header>
        </SquareContainer>
    </Container>

export default SocialCard;
