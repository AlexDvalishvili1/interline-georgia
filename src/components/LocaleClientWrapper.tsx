"use client";

import {ReactNode, useEffect} from "react";
import {useLanguage, type Language} from "@/contexts/LanguageContext";

type LocaleParam = "ge" | "ru" | "en";

const localeToLanguage: Record<LocaleParam, Language> = {
    ge: "ka",
    ru: "ru",
    en: "en",
};

export default function LocaleClientWrapper({
                                                children,
                                                locale,
                                            }: {
    children: ReactNode;
    locale: LocaleParam;
}) {
    const {setLanguage, language} = useLanguage();

    useEffect(() => {
        const internalLanguage = localeToLanguage[locale];
        if (language !== internalLanguage) {
            setLanguage(internalLanguage);
        }
    }, [locale, language, setLanguage]);

    return <>{children}</>;
}