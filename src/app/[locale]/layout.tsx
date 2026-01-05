// src/app/[locale]/layout.tsx

import {notFound} from "next/navigation";
import {Layout} from "@/components/layout/Layout";
import LocaleClientWrapper from "@/components/LocaleClientWrapper";

type LocaleParam = "ge" | "ru" | "en";

function isLocale(x: string): x is LocaleParam {
    return x === "ge" || x === "ru" || x === "en";
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const {locale} = await params;

    if (!isLocale(locale)) notFound();

    return (
        <LocaleClientWrapper locale={locale}>
            <Layout>{children}</Layout>
        </LocaleClientWrapper>
    );
}