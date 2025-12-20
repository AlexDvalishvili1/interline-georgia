import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">("enter");

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
    : false;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayChildren(children);
      return;
    }

    // Start exit animation
    setTransitionStage("exit");
    setIsAnimating(true);

    const exitTimer = setTimeout(() => {
      // Update children after exit
      setDisplayChildren(children);
      setTransitionStage("enter");
      
      // End animation after enter
      const enterTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(enterTimer);
    }, 150);

    return () => clearTimeout(exitTimer);
  }, [location.pathname, children, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        transitionStage === "exit" && "opacity-0 translate-y-2",
        transitionStage === "enter" && !isAnimating && "opacity-100 translate-y-0",
        transitionStage === "enter" && isAnimating && "opacity-100 translate-y-0"
      )}
      style={{
        willChange: isAnimating ? "opacity, transform" : "auto",
      }}
    >
      {displayChildren}
    </div>
  );
};
