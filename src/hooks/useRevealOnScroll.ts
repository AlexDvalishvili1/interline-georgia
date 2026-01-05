"use client";

import {useEffect, useRef, useState} from "react";

interface UseRevealOnScrollOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useRevealOnScroll = (options: UseRevealOnScrollOptions = {}) => {
    const {threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true} = options;
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            {threshold, rootMargin}
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return {ref, isVisible};
};

interface UseStaggerRevealOptions extends UseRevealOnScrollOptions {
    ready?: boolean; // Only observe when data is ready
}

// Hook for multiple elements with stagger - waits for data to be ready
export const useStaggerReveal = (itemCount: number, options: UseStaggerRevealOptions = {}) => {
    const {threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true, ready = true} = options;
    const containerRef = useRef<HTMLElement>(null);
    const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
    const hasTriggered = useRef(false);

    // Reset visible items when item count changes
    useEffect(() => {
        if (itemCount > 0 && ready) {
            setVisibleItems(new Array(itemCount).fill(false));
        }
    }, [itemCount, ready]);

    useEffect(() => {
        // Don't observe until data is ready
        if (!ready || itemCount === 0) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            setVisibleItems(new Array(itemCount).fill(true));
            return;
        }

        const container = containerRef.current;
        if (!container) return;

        // If already triggered and triggerOnce, don't observe again
        if (hasTriggered.current && triggerOnce) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered.current) {
                    hasTriggered.current = true;
                    // Stagger reveal with delays
                    for (let i = 0; i < itemCount; i++) {
                        setTimeout(() => {
                            setVisibleItems((prev) => {
                                const updated = [...prev];
                                updated[i] = true;
                                return updated;
                            });
                        }, i * 100); // 100ms stagger
                    }
                    if (triggerOnce) {
                        observer.unobserve(container);
                    }
                }
            },
            {threshold, rootMargin}
        );

        observer.observe(container);

        return () => observer.disconnect();
    }, [itemCount, threshold, rootMargin, triggerOnce, ready]);

    return {containerRef, visibleItems};
};
