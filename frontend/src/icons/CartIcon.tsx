import React from 'react';

const SearchIcon: React.FC<{ className?: string }> = (props) =>
    <svg id="Icons" height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg" className={props.className}>
        <path d="m6 1h-3a1 1 0 0 0 0 2h2v14a1 1 0 0 0 1 1h12a1 1 0 0 0 0-2h-11v-2h12a1 1 0 0 0 .948-.684l2-6a1 1 0 0 0 -.948-1.316h-14v-4a1 1 0 0 0 -1-1zm13.612 7-1.333 4h-11.279v-4z" />
        <circle cx="6.5" cy="20.5" r="1.5" />
        <circle cx="16.5" cy="20.5" r="1.5" />
    </svg>;

export default SearchIcon;