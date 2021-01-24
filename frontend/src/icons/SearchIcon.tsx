import React from 'react';

const SearchIcon: React.FC<{ className?: string }> = (props) =>
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 64 64" {...props}>
        <path d="M62.9,56.5L45.9,42.7c7.2-9.9,6.1-23.7-2.7-32.5C38.4,5.3,32,2.7,25.3,2.7S12.3,5.3,7.5,10.1S0,21.3,0,28s2.7,13.1,7.5,17.9
c5.1,5.1,11.5,7.5,17.9,7.5c6.1,0,12.3-2.1,17.1-6.7l17.3,14.1c0.5,0.5,1.1,0.5,1.6,0.5c0.8,0,1.6-0.3,2.1-1.1
C64.3,59.2,64.3,57.6,62.9,56.5z M25.3,48c-5.3,0-10.4-2.1-14.1-5.9C7.5,38.4,5.3,33.3,5.3,28s2.1-10.4,5.9-14.1S20,8,25.3,8
s10.4,2.1,14.1,5.9s5.9,8.8,5.9,14.1s-2.1,10.4-5.9,14.1C35.7,45.9,30.7,48,25.3,48z"/>
    </svg>;

export default SearchIcon;