import { useState, useEffect, useCallback } from 'react';

export default function useParallaxOffset(element: React.RefObject<HTMLElement>, maxTop = 48, maxBottom = 256, topCoeff = 0.48, bottomCoeff = 0.48) {
    const [offset, setOffset] = useState(0);

    const calcOffset = useCallback(() => {
        if (!element.current) {
            return;
        }
        const delta = element.current.getBoundingClientRect().top;
        let result = delta > 0 ? (-1 * delta * topCoeff) : (-1 * delta * bottomCoeff);
        if (delta > 0 && result < (-1 * maxTop)) {
            result = -1 * maxTop;
        }
        if (delta <= 0 && result > maxBottom) {
            result = maxBottom;
        }
        setOffset(result);
    }, [element, maxTop, maxBottom, topCoeff, bottomCoeff]);

    useEffect(() => {
        calcOffset();
        document.addEventListener('scroll', calcOffset);
        return () => document.removeEventListener('scroll', calcOffset);
    }, []);

    return offset;
}