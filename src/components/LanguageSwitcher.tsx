"use client";

import React, {useState, useRef, useEffect, useCallback} from "react";
import {useRouter, usePathname, useSearchParams, useParams} from "next/navigation";
import {useLanguage} from "@/contexts/LanguageContext";
import {languageToUrlLocale, type UrlLocale} from "@/hooks/useLocalizedPath";
import {ChevronDown} from "lucide-react";
import {cn} from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";

const languages: { urlCode: UrlLocale; label: string; countryCode: string; shortCode: string }[] = [
    {urlCode: "ge", label: "ქართული", countryCode: "GE", shortCode: "GE"},
    {urlCode: "ru", label: "Русский", countryCode: "RU", shortCode: "RU"},
    {urlCode: "en", label: "English", countryCode: "US", shortCode: "EN"},
];

const Flag = ({code}: { code: string }) => (
    <ReactCountryFlag
        countryCode={code}
        svg
        aria-label={code}
        style={{
            width: "1.25rem",   // ~ w-5
            height: "0.9rem",   // ~ h-3/4-ish
            borderRadius: "2px",
            overflow: "hidden",
            display: "inline-block",
        }}
    />
);

export const LanguageSwitcher = () => {
    const {language} = useLanguage();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {locale} = useParams<{ locale?: string }>();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const currentUrlLocale = (locale as UrlLocale | undefined) ?? languageToUrlLocale(language);
    const currentLang = languages.find((l) => l.urlCode === currentUrlLocale) ?? languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
            }
        };

        if (isOpen) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    const handleSelect = useCallback(
        (newUrlLocale: UrlLocale) => {
            const pathWithoutLocale = pathname.replace(/^\/(ge|ru|en)(?=\/|$)/, "") || "";
            const query = searchParams.toString();
            const nextUrl = `/${newUrlLocale}${pathWithoutLocale}${query ? `?${query}` : ""}`;

            router.push(nextUrl);
            setIsOpen(false);
            setFocusedIndex(-1);
        },
        [pathname, searchParams, router]
    );

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (!isOpen) {
                if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setIsOpen(true);
                    setFocusedIndex(0);
                }
                return;
            }

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    setFocusedIndex((prev) => (prev + 1) % languages.length);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setFocusedIndex((prev) => (prev - 1 + languages.length) % languages.length);
                    break;
                case "Enter":
                case " ":
                    event.preventDefault();
                    if (focusedIndex >= 0) handleSelect(languages[focusedIndex].urlCode);
                    break;
                case "Tab":
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    break;
            }
        },
        [isOpen, focusedIndex, handleSelect]
    );

    return (
        <div ref={dropdownRef} className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                    "bg-secondary hover:bg-secondary/80 transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                )}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
            >
        <span aria-hidden="true">
          <Flag code={currentLang.countryCode}/>
        </span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <ChevronDown
                    size={16}
                    className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>

            <div
                className={cn(
                    "absolute right-0 mt-2 w-40 py-1 rounded-lg shadow-lg z-50",
                    "bg-popover border border-border",
                    "origin-top-right transition-all duration-200",
                    isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                )}
                role="listbox"
                aria-label="Language options"
                onKeyDown={handleKeyDown}
            >
                {languages.map((lang, index) => (
                    <button
                        key={lang.urlCode}
                        onClick={() => handleSelect(lang.urlCode)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                            "focus:outline-none",
                            currentUrlLocale === lang.urlCode ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted",
                            focusedIndex === index && "bg-muted"
                        )}
                        role="option"
                        aria-selected={currentUrlLocale === lang.urlCode}
                        tabIndex={-1}
                    >
            <span aria-hidden="true">
              <Flag code={lang.countryCode}/>
            </span>
                        <span>{lang.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};