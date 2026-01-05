"use client";

import {useParams} from "next/navigation";

/**
 * Hook to get a function that prefixes paths with the current URL locale.
 * Usage: const lp = useLocalizedPath(); lp("/offers") returns "/ge/offers"
 */
export const useLocalizedPath = () => {
    const params = useParams<{ locale?: string }>();
    const currentLocale = params?.locale ?? "ge";

    return (path: string): string => {
        // HARD GUARD: catches any accidental object passed as `path`
        if (typeof path !== "string") {
            console.error("useLocalizedPath: path must be a string, got:", path);
            return `/${currentLocale}`;
        }

        const cleanPath = path.startsWith("/") ? path : `/${path}`;

        if (cleanPath === "/") return `/${currentLocale}`;

        return `/${currentLocale}${cleanPath}`;
    };
};

/**
 * URL locale to internal language code mapping
 * ge -> ka (Georgian)
 * ru -> ru (Russian)
 * en -> en (English)
 */
export const urlLocaleToLanguage = (urlLocale: string): "ka" | "ru" | "en" => {
    switch (urlLocale) {
        case "ge":
            return "ka";
        case "ru":
            return "ru";
        case "en":
            return "en";
        default:
            return "ka"; // Default to Georgian
    }
};

/**
 * Internal language code to URL locale mapping
 * ka -> ge (Georgian)
 * ru -> ru (Russian)
 * en -> en (English)
 */
export const languageToUrlLocale = (language: string): "ge" | "ru" | "en" => {
    switch (language) {
        case "ka":
            return "ge";
        case "ru":
            return "ru";
        case "en":
            return "en";
        default:
            return "ge"; // Default to Georgian
    }
};

export const VALID_LOCALES = ["ge", "ru", "en"] as const;
export type UrlLocale = typeof VALID_LOCALES[number];

export const isValidLocale = (locale: string): locale is UrlLocale => {
    return VALID_LOCALES.includes(locale as UrlLocale);
};
