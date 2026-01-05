"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {forwardRef} from "react";
import {cn} from "@/lib/utils";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;                // ✅ force string only
    activeClassName?: string;
    exact?: boolean;
};

const NavLink = forwardRef<HTMLAnchorElement, Props>(
    ({className, activeClassName, exact, href, ...props}, ref) => {
        const pathname = usePathname();

        // guard: if someone passes something weird, catch it immediately
        if (typeof href !== "string") {
            console.error("NavLink: href must be a string. Received:", href);
        }

        const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");

        return (
            <Link
                ref={ref}
                href={href}
                className={cn(className, isActive && activeClassName)}
                {...props}
            />
        );
    }
);

NavLink.displayName = "NavLink";

export {NavLink};