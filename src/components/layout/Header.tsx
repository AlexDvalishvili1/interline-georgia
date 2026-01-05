"use client";

import {useState} from "react";
import {Menu, X} from "lucide-react";
import {useLanguage} from "@/contexts/LanguageContext";
import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import {useSiteSettings, getLocalizedSettingsField} from "@/hooks/useSiteSettings";
import {useLocalizedPath} from "@/hooks/useLocalizedPath";
import {cn} from "@/lib/utils";
import logoSvg from "@/assets/logo.svg";
import Link from "next/link";
import {usePathname} from 'next/navigation'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {t, language} = useLanguage();
    const {data: settings} = useSiteSettings();
    const pathname = usePathname();
    const lp = useLocalizedPath();

    const companyName = getLocalizedSettingsField(settings, "company_name", language) || "Interline Georgia";
    const logoUrl = settings?.logo_url || logoSvg;

    const navLinks = [
        {href: lp("/"), label: t("nav.home"), match: ""},
        {href: lp("/offers"), label: t("nav.offers"), match: "/offers"},
        {href: lp("/services"), label: t("nav.services"), match: "/services"},
        {href: lp("/about"), label: t("nav.about"), match: "/about"},
        {href: lp("/contacts"), label: t("nav.contacts"), match: "/contacts"},
    ];

    navLinks.forEach((l) => {
        if (typeof l.href !== "string") console.error("Header href not string:", l);
    });

    const isActive = (match: string) => {
        // Extract path after locale
        const pathAfterLocale = pathname.replace(/^\/(ge|ru|en)/, "");
        if (match === "") return pathAfterLocale === "" || pathAfterLocale === "/";
        return pathAfterLocale.startsWith(match);
    };

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container-custom">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href={lp("/")} className="flex items-center gap-3">
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className="h-8 md:h-10 w-auto object-contain"
                        />
                        <div className="flex items-center gap-2">
              <span className="text-2xl font-heading font-bold text-primary">
                {companyName.split(" ")[0] || "Interline"}
              </span>
                            <span className="hidden sm:inline text-xs text-muted-foreground uppercase tracking-widest">
                {companyName.split(" ").slice(1).join(" ") || "Georgia"}
              </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-accent",
                                    isActive(link.match)
                                        ? "text-accent"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Language Switcher & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher/>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-foreground"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden border-t border-border py-4 animate-fade-in">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={cn(
                                        "text-base font-medium transition-colors py-2",
                                        isActive(link.match)
                                            ? "text-accent"
                                            : "text-muted-foreground hover:text-accent"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};
