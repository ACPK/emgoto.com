import styled from 'styled-components';

import colors from '../../common';

export const Container = styled.div`
    margin: 0 auto;
    padding: 0 16px;
    max-width: 800px;
    margin-bottom: 16px;
`;

export const SquareContainer = styled.div`
    box-sizing: border-box;
    background-color: ${colors.black};
    border-radius: 4px;
`;

export const TextContainer = styled.div`
    padding: 16px;
`;
