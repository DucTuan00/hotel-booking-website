import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
    threshold?: number;
    rootMargin?: string;
    freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
    options: UseIntersectionObserverOptions = {}
) => {
    const { threshold = 0.3, rootMargin = '0px', freezeOnceVisible = false } = options;
    const [isVisible, setIsVisible] = useState(false);
    const [hasBeenVisible, setHasBeenVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (!hasBeenVisible) {
                        setHasBeenVisible(true);
                    }
                } else if (!freezeOnceVisible || !hasBeenVisible) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        const currentRef = elementRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin, freezeOnceVisible, hasBeenVisible]);

    return { elementRef, isVisible, hasBeenVisible };
};

export default useIntersectionObserver;
