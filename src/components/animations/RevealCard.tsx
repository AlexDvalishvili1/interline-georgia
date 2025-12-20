import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: ReactNode;
  className?: string;
  isVisible: boolean;
  index?: number;
}

export const RevealCard = ({ children, className, isVisible, index = 0 }: RevealCardProps) => {
  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        className
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 30px, 0)",
        transitionDelay: `${index * 100}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};
