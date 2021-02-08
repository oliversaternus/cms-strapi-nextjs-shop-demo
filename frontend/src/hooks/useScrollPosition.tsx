import { useState, useEffect } from 'react';

export default function useScrollPosition() {
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        setScrollTop(window.scrollY);
        const onScroll = () => {
            setScrollTop(window.scrollY);
        };
        document.addEventListener('scroll', onScroll);
        return () => document.removeEventListener('scroll', onScroll);
    }, []);

    return scrollTop;
}