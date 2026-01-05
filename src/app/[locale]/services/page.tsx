"use client";

import {CheckCircle} from "lucide-react";
import {useLanguage} from "@/contexts/LanguageContext";
import {RevealSection} from "@/components/animations";
import {
    useSiteSettings,
    getContentField,
    getContentArray,
    type ServiceItem,
    type FeatureItem
} from "@/hooks/useSiteSettings";
import {getIconComponent} from "@/lib/iconMap";

// Default service items when DB is empty - will be seeded to DB
const DEFAULT_SERVICES: ServiceItem[] = [
    {
        id: "1",
        icon: "map",
        images: ["https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"],
        title: {en: "Tours & Excursions", ru: "Туры и экскурсии", ka: "ტურები და ექსკურსიები"},
        description: {
            en: "Explore destinations worldwide with our expertly curated tours.",
            ru: "Исследуйте направления по всему миру с нашими турами.",
            ka: "გამოიკვლიეთ მიმართულებები მთელ მსოფლიოში."
        },
        features: [
            {id: "f1", text: {en: "Guided group tours", ru: "Групповые туры с гидом", ka: "გიდიანი ჯგუფური ტურები"}},
            {id: "f2", text: {en: "Private custom tours", ru: "Индивидуальные туры", ka: "პირადი ტურები"}},
            {
                id: "f3",
                text: {en: "Adventure travel", ru: "Приключенческие путешествия", ka: "სათავგადასავლო მოგზაურობა"}
            },
        ],
    },
    {
        id: "2",
        icon: "plane",
        images: ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"],
        title: {en: "Air Tickets", ru: "Авиабилеты", ka: "ავიაბილეთები"},
        description: {
            en: "Best deals on flights to any destination worldwide.",
            ru: "Лучшие предложения на авиабилеты.",
            ka: "საუკეთესო შეთავაზებები ფრენებზე."
        },
        features: [
            {id: "f4", text: {en: "Competitive prices", ru: "Конкурентные цены", ka: "კონკურენტული ფასები"}},
            {
                id: "f5",
                text: {en: "All major airlines", ru: "Все крупные авиакомпании", ka: "ყველა მთავარი ავიაკომპანია"}
            },
            {id: "f6", text: {en: "Flexible booking", ru: "Гибкое бронирование", ka: "მოქნილი დაჯავშნა"}},
        ],
    },
    {
        id: "3",
        icon: "ship",
        images: ["https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80"],
        title: {en: "Cruises", ru: "Круизы", ka: "კრუიზები"},
        description: {
            en: "Luxury cruise experiences on the world's best ships.",
            ru: "Роскошные круизы на лучших лайнерах мира.",
            ka: "ფუფუნების კრუიზები საუკეთესო გემებზე."
        },
        features: [
            {id: "f7", text: {en: "All cruise lines", ru: "Все круизные линии", ka: "ყველა საკრუიზო ხაზი"}},
            {id: "f8", text: {en: "River cruises", ru: "Речные круизы", ka: "მდინარის კრუიზები"}},
            {id: "f9", text: {en: "Expedition cruises", ru: "Экспедиционные круизы", ka: "საექსპედიციო კრუიზები"}},
        ],
    },
];

const Page = () => {
    const {t, language} = useLanguage();
    const {data: settings} = useSiteSettings();
    const content = settings?.site_content;

    // Get page content from DB with fallback to translation keys
    const pageTitle = getContentField(content, "services.pageTitle", language) || t("servicesPage.title");
    const pageSubtitle = getContentField(content, "services.pageSubtitle", language) || t("servicesPage.subtitle");
    const ctaTitle = getContentField(content, "services.ctaTitle", language) || t("contact.title");
    const ctaSubtitle = getContentField(content, "services.ctaSubtitle", language) || t("hero.subtitle");

    // Get phones/emails from settings for CTA
    const phone = settings?.phones?.[0] || settings?.phone || "+995 32 200 00 00";
    const email = settings?.emails?.[0] || settings?.email || "info@interline.ge";

    // Get service items from DB or use defaults
    const dbServices = getContentArray<ServiceItem>(content, "services.items");
    const services = dbServices.length > 0 ? dbServices : DEFAULT_SERVICES;

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
                <div className="container-custom">
                    <RevealSection>
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                                {pageTitle}
                            </h1>
                            <p className="text-lg opacity-90">
                                {pageSubtitle}
                            </p>
                        </div>
                    </RevealSection>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold"/>
            </section>

            {/* Services List */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="space-y-20">
                        {services.map((service, index) => {
                            const Icon = getIconComponent(service.icon);
                            const title = service.title[language as keyof typeof service.title] || service.title.en || "";
                            const description = service.description[language as keyof typeof service.description] || service.description.en || "";
                            const features = service.features || [];
                            // Use first image from images array, fallback to placeholder
                            const imageUrl = service.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80";

                            return (
                                <div
                                    key={service.id}
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                                        index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}
                                >
                                    {/* Image */}
                                    <RevealSection
                                        direction={index % 2 === 0 ? "left" : "right"}
                                        className={`order-1 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                                    >
                                        <div
                                            className="aspect-[4/3] rounded-xl overflow-hidden image-placeholder group">
                                            <img
                                                src={imageUrl}
                                                alt={title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    </RevealSection>

                                    {/* Content */}
                                    <RevealSection
                                        direction={index % 2 === 0 ? "right" : "left"}
                                        delay={100}
                                        className={`order-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div
                                                className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                                                <Icon className="w-7 h-7 text-accent"/>
                                            </div>
                                            <h2 className="text-3xl font-heading font-bold">
                                                {title}
                                            </h2>
                                        </div>

                                        <p className="text-muted-foreground text-lg mb-8">
                                            {description}
                                        </p>

                                        {features.length > 0 && (
                                            <ul className="space-y-3">
                                                {features.map((feature, featureIndex) => {
                                                    const featureText = feature.text?.[language as keyof typeof feature.text] || feature.text?.en || "";
                                                    return (
                                                        <li
                                                            key={feature.id || featureIndex}
                                                            className="flex items-center gap-3 transition-all duration-300 hover:translate-x-1"
                                                            style={{transitionDelay: `${featureIndex * 50}ms`}}
                                                        >
                                                            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0"/>
                                                            <span>{featureText}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </RevealSection>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-secondary">
                <div className="container-custom text-center">
                    <RevealSection>
                        <h2 className="text-3xl font-heading font-bold mb-4">
                            {ctaTitle}
                        </h2>
                        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                            {ctaSubtitle}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                {phone}
                            </a>
                            <a
                                href={`mailto:${email}`}
                                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-all duration-300 hover:scale-105"
                            >
                                {email}
                            </a>
                        </div>
                    </RevealSection>
                </div>
            </section>
        </div>
    );
};

export default Page;