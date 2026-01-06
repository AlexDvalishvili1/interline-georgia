import {ReactNode, forwardRef, JSX} from "react";
import {useRevealOnScroll} from "@/hooks/useRevealOnScroll";
import {cn} from "@/lib/utils";

interface RevealSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    as?: keyof JSX.IntrinsicElements;
}

export const RevealSection = forwardRef<HTMLElement, RevealSectionProps>(
    ({children, className, delay = 0, direction = "up", as: Component = "div"}, _) => {
        const {ref, isVisible} = useRevealOnScroll();

        const getTransform = () => {
            if (isVisible) return "translate3d(0, 0, 0)";
            switch (direction) {
                case "up":
                    return "translate3d(0, 30px, 0)";
                case "down":
                    return "translate3d(0, -30px, 0)";
                case "left":
                    return "translate3d(30px, 0, 0)";
                case "right":
                    return "translate3d(-30px, 0, 0)";
                case "none":
                    return "translate3d(0, 0, 0)";
                default:
                    return "translate3d(0, 30px, 0)";
            }
        };

        const ElementComponent = Component as any;

        return (
            <ElementComponent
                ref={ref}
                className={cn(
                    "transition-all duration-700 ease-out",
                    className
                )}
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: getTransform(),
                    transitionDelay: `${delay}ms`,
                    willChange: isVisible ? "auto" : "opacity, transform",
                }}
            >
                {children}
            </ElementComponent>
        );
    }
);

RevealSection.displayName = "RevealSection";
