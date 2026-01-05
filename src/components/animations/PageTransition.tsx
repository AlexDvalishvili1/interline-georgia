"use client";

import {ReactNode, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

interface PageTransitionProps {
    children: ReactNode;
}

export const PageTransition = ({children}: PageTransitionProps) => {
    const pathname = usePathname();

    const [isAnimating, setIsAnimating] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setPrefersReducedMotion(mq.matches);

        update();
        if (mq.addEventListener) mq.addEventListener("change", update);
        else mq.addListener(update);

        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", update);
            else mq.removeListener(update);
        };
    }, []);

    useEffect(() => {
        let enterTimer: number | undefined;
        let exitTimer: number | undefined;

        if (prefersReducedMotion) {
            setDisplayChildren(children);
            return;
        }

        setTransitionStage("exit");
        setIsAnimating(true);

        exitTimer = window.setTimeout(() => {
            setDisplayChildren(children);
            setTransitionStage("enter");

            enterTimer = window.setTimeout(() => {
                setIsAnimating(false);
            }, 300);
        }, 150);

        return () => {
            if (exitTimer) window.clearTimeout(exitTimer);
            if (enterTimer) window.clearTimeout(enterTimer);
        };
    }, [pathname, children, prefersReducedMotion]);

    if (prefersReducedMotion) return <>{children}</>;

    return (
        <div
            className={cn(
                "transition-all duration-300 ease-out",
                transitionStage === "exit" && "opacity-0 translate-y-2",
                transitionStage === "enter" && "opacity-100 translate-y-0"
            )}
            style={{willChange: isAnimating ? "opacity, transform" : "auto"}}
        >
            {displayChildren}
        </div>
    );
};