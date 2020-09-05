import React from 'react';
import DevIcon from '../../../images/icon-dev';
import { IconContainer, Interpunct } from '../styled';

const Comments = ({ devUrl }) => (
    <>
        <Interpunct>·</Interpunct>{' '}
        <IconContainer>
            <a href="" className="comment-link">
                <div>
                    <DevIcon />
                    <span>0 comments</span>
                </div>
            </a>
        </IconContainer>
    </>
);

export default Comments;
