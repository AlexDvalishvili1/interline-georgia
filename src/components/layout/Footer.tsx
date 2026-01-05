"use client";

import {Phone, Mail, MapPin, Facebook, Instagram} from "lucide-react";
import {useLanguage} from "@/contexts/LanguageContext";
import {useSiteSettings, getLocalizedSettingsField, getContentField} from "@/hooks/useSiteSettings";
import {useLocalizedPath} from "@/hooks/useLocalizedPath";
import Link from "next/link";
import Image from "next/image";

// TikTok icon component
const TikTokIcon = ({size = 20}: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
);

export const Footer = () => {
    const {t, language} = useLanguage();
    const {data: settings} = useSiteSettings();
    const lp = useLocalizedPath();
    const currentYear = new Date().getFullYear();

    const companyName = getLocalizedSettingsField(settings, "company_name", language) || "Interline Georgia";
    const address = getLocalizedSettingsField(settings, "address", language) || "Tbilisi, Georgia";

    // Get content from site_content with fallback to translation keys
    const content = settings?.site_content;
    const tagline = getContentField(content, "footer.tagline", language) || t("hero.subtitle");
    const quickLinksTitle = getContentField(content, "footer.quickLinksTitle", language) || t("nav.home");
    const contactTitle = getContentField(content, "footer.contactTitle", language) || t("contact.title");
    const followUsTitle = getContentField(content, "footer.followUsTitle", language) || t("contact.followUs");
    const rightsText = getContentField(content, "footer.rightsText", language) || t("footer.rights");

    // Get all phones
    const phones = settings?.phones && settings.phones.length > 0 ? settings.phones : (settings?.phone ? [settings.phone] : []);

    // Get all emails
    const emails = settings?.emails && settings.emails.length > 0 ? settings.emails : (settings?.email ? [settings.email] : []);

    // Build social links array
    const socialLinks = [];
    if (settings?.facebook_url) {
        socialLinks.push({icon: Facebook, url: settings.facebook_url, label: "Facebook"});
    }
    if (settings?.instagram_url) {
        socialLinks.push({icon: Instagram, url: settings.instagram_url, label: "Instagram"});
    }
    if (settings?.tiktok_url) {
        socialLinks.push({icon: TikTokIcon, url: settings.tiktok_url, label: "TikTok"});
    }

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href={lp("/")} className="inline-flex items-center gap-3 mb-4">
                            {settings?.logo_url && (
                                <Image
                                    src={settings.logo_url}
                                    alt="Logo"
                                    className="h-8 w-auto object-contain"
                                    width={120}
                                    height={32}
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                            <div>
                                <span className="text-2xl font-heading font-bold">{companyName.split(" ")[0]}</span>
                                <span className="block text-xs uppercase tracking-widest opacity-70">
                  {companyName.split(" ").slice(1).join(" ") || "Georgia"}
                </span>
                            </div>
                        </Link>
                        <p className="text-sm opacity-80">
                            {tagline}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4">{quickLinksTitle}</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href={lp("/offers")}
                                  className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                                {t("nav.offers")}
                            </Link>
                            <Link href={lp("/services")}
                                  className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                                {t("nav.services")}
                            </Link>
                            <Link href={lp("/about")}
                                  className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                                {t("nav.about")}
                            </Link>
                            <Link href={lp("/contacts")}
                                  className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                                {t("nav.contacts")}
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4">{contactTitle}</h4>
                        <div className="flex flex-col gap-3">
                            {phones.map((phone, idx) => (
                                <a key={idx} href={`tel:${phone.replace(/\s/g, "")}`}
                                   className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                                    <Phone size={16}/>
                                    {phone}
                                </a>
                            ))}
                            {emails.map((email, idx) => (
                                <a key={idx} href={`mailto:${email}`}
                                   className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                                    <Mail size={16}/>
                                    {email}
                                </a>
                            ))}
                            <div className="flex items-start gap-2 text-sm opacity-80">
                                <MapPin size={16} className="mt-0.5 flex-shrink-0"/>
                                <span>{address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h4 className="font-heading font-semibold mb-4">{followUsTitle}</h4>
                        <div className="flex gap-4">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={20}/>
                                    </a>
                                ))
                            ) : (
                                <>
                                    <div className="p-2 rounded-full bg-primary-foreground/10">
                                        <Facebook size={20}/>
                                    </div>
                                    <div className="p-2 rounded-full bg-primary-foreground/10">
                                        <Instagram size={20}/>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-primary-foreground/10">
                    <p className="text-sm opacity-70">
                        © {currentYear} {companyName}. {rightsText}.
                    </p>
                </div>
            </div>
        </footer>
    );
};
