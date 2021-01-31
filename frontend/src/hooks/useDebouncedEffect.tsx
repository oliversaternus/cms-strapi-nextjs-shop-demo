import { useEffect, EffectCallback, DependencyList } from 'react';

export default function useDebounce(effect: EffectCallback, delay: number, deps?: DependencyList | undefined) {
    useEffect(
        () => {
            let cleanup: void | (() => void | undefined);
            const timeout = setTimeout(() => {
                cleanup = effect();
            }, delay);

            return () => {
                if (typeof cleanup === 'function') {
                    cleanup();
                }
                clearTimeout(timeout);
            };
        },
        [...(deps || [])]
    );
}