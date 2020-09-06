import { createGlobalStyle } from 'styled-components';

// https://github.com/voronianski/oceanic-next-color-scheme
export const yellow = '#FAC863';
export const green = '#99C794';
export const darkGreen = '#5FB3B3';
export const blue = '#6699CC';
export const purple = '#C594C5';
export const white = '#D8DEE9';
export const offWhite = '#b9cbf0';
export const lightGrey = '#2c3947';

// From https://cocopon.github.io/iceberg.vim/
export const grey = '#26293A';
export const darkGrey = '#1F2233';
export const black = '#161822';

export default {
    yellow,
    green,
    darkGreen,
    blue,
    purple,
    white,
    offWhite,
    lightGrey,
    grey,
    darkGrey,
    black,
};

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${darkGrey};
    color: ${white};
    margin: 0px;
    font-family: 'Open Sans', sans-serif;
    line-height: 1.6;
    text-rendering: optimizeLegibility;
    font-size: 1.1rem;
  }

  a {
    text-decoration: none;
    color: ${blue};
  }

  a:hover {
    color: ${white};
  }

  h2 a{
    color: inherit;
  }

  h2 a:hover{
    color: inherit;
  }

  b, strong {
    color:  ${purple};
  }

  i, em {
    color: ${offWhite}
  }

  h1 {
    margin-top: -4px;
    margin-bottom: 8px;
    font-weight: normal;
    letter-spacing: 1px;
  }

  h2 {
    font-weight: normal;
    margin-top: 24px;
    margin-bottom: 8px;
    color: ${green};
    letter-spacing: 1px;
  }

  h3 {
    font-weight: normal;
    margin-bottom: 8px;
    letter-spacing: 1px;
    color: ${darkGreen};
  }

  blockquote {
    border-left: 2px solid ${darkGreen};
    padding-left: 8px;
  }

  .gatsby-resp-image-image {
    border-radius: 8px;
    box-shadow: none !important;
  }

  figcaption {
    text-align: center;
    padding-top: 4px;
    font-size: 14px;
  }

  h2, h3, h4 {
    &:hover > .anchor.after > svg {
      visibility: visible;
      fill: ${offWhite};
      margin-left: 8px;
    }

    .anchor.after > svg {
      visibility: hidden;
    }
  }
`;
