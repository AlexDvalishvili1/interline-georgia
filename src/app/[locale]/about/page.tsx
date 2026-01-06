"use client";

import {useLanguage} from "@/contexts/LanguageContext";
import {Card, CardContent} from "@/components/ui/card";
import {RevealSection} from "@/components/animations";
import {useStaggerReveal} from "@/hooks/useRevealOnScroll";
import {
    useSiteSettings,
    getContentField,
    getContentArray,
    type ValueItem,
    type StatItem
} from "@/hooks/useSiteSettings";
import {getIconComponent} from "@/lib/iconMap";
import Image from "next/image";

// Default values when DB is empty
const DEFAULT_VALUES: ValueItem[] = [
    {
        id: "1",
        icon: "award",
        title: {en: "Trust", ru: "Доверие", ka: "ნდობა"},
        description: {
            en: "Building lasting relationships through reliability and honesty.",
            ru: "Построение долгосрочных отношений через надежность и честность.",
            ka: "გრძელვადიანი ურთიერთობების დამყარება სანდოობით და პატიოსნებით."
        }
    },
    {
        id: "2",
        icon: "star",
        title: {en: "Quality", ru: "Качество", ka: "ხარისხი"},
        description: {
            en: "Delivering exceptional service in every interaction.",
            ru: "Предоставление исключительного сервиса в каждом взаимодействии.",
            ka: "განსაკუთრებული მომსახურების მიწოდება ყველა ინტერაქციაში."
        }
    },
    {
        id: "3",
        icon: "heart",
        title: {en: "Care", ru: "Забота", ka: "ზრუნვა"},
        description: {
            en: "Putting our clients' needs and satisfaction first.",
            ru: "Ставим потребности и удовлетворенность клиентов на первое место.",
            ka: "ჩვენი კლიენტების საჭიროებები და კმაყოფილება პირველ ადგილზეა."
        }
    },
];

const DEFAULT_STATS: StatItem[] = [
    {id: "1", value: "20+", label: {en: "Years Experience", ru: "Лет опыта", ka: "წლის გამოცდილება"}},
    {id: "2", value: "5000+", label: {en: "Cruise Routes", ru: "Круизных маршрутов", ka: "საკრუიზო მარშრუტი"}},
    {id: "3", value: "100+", label: {en: "Destinations", ru: "Направлений", ka: "მიმართულება"}},
    {id: "4", value: "10K+", label: {en: "Happy Clients", ru: "Довольных клиентов", ka: "კმაყოფილი კლიენტი"}},
];

const Page = () => {
    const {t, language} = useLanguage();
    const {data: settings} = useSiteSettings();
    const content = settings?.site_content;

    // Get page content from DB with fallback to translation keys
    const pageTitle = getContentField(content, "about.pageTitle", language) || t("about.title");
    const pageSubtitle = getContentField(content, "about.pageSubtitle", language) || t("about.subtitle");
    const description = getContentField(content, "about.description", language) || t("about.description");
    const missionTitle = getContentField(content, "about.missionTitle", language) || t("about.mission");
    const missionText = getContentField(content, "about.missionText", language) || t("about.missionText");
    const valuesTitle = getContentField(content, "about.valuesTitle", language) || t("about.values");
    const aboutImageUrl = getContentField(content, "about.imageUrl", language) || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80";

    // Get values and stats from DB or use defaults
    const dbValues = getContentArray<ValueItem>(content, "about.values");
    const values = dbValues.length > 0 ? dbValues : DEFAULT_VALUES;

    const dbStats = getContentArray<StatItem>(content, "about.stats");
    const stats = dbStats.length > 0 ? dbStats : DEFAULT_STATS;

    const {containerRef: valuesRef, visibleItems: valuesVisible} = useStaggerReveal(values.length);
    const {containerRef: statsRef, visibleItems: statsVisible} = useStaggerReveal(stats.length);

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

            {/* Main Content */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <RevealSection direction="left">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden image-placeholder group">
                                <Image
                                    src={aboutImageUrl}
                                    alt="About Us"
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </RevealSection>

                        {/* Text Content */}
                        <RevealSection direction="right" delay={100}>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                {description}
                            </p>

                            <div className="p-6 bg-secondary rounded-xl transition-all duration-300 hover:shadow-lg">
                                <h3 className="text-xl font-heading font-semibold mb-3">
                                    {missionTitle}
                                </h3>
                                <p className="text-muted-foreground">
                                    {missionText}
                                </p>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding bg-secondary">
                <div className="container-custom">
                    <RevealSection>
                        <h2 className="text-3xl font-heading font-bold text-center mb-12">
                            {valuesTitle}
                        </h2>
                    </RevealSection>

                    <div
                        ref={valuesRef as React.RefObject<HTMLDivElement>}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
                    >
                        {values.map((value, index) => {
                            const Icon = getIconComponent(value.icon);
                            const title =
                                value.title[language as keyof typeof value.title] || value.title.en || "";
                            const valueDescription =
                                value.description[language as keyof typeof value.description] ||
                                value.description.en ||
                                "";

                            return (
                                <div
                                    key={value.id}
                                    className="transition-all duration-500 ease-out h-full"
                                    style={{
                                        opacity: valuesVisible[index] ? 1 : 0,
                                        transform: valuesVisible[index] ? "translateY(0)" : "translateY(30px)",
                                    }}
                                >
                                    <Card className="hover-lift group h-full">
                                        <CardContent className="p-8 text-center h-full flex flex-col">
                                            <div
                                                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                                <Icon className="w-8 h-8 text-gold"/>
                                            </div>

                                            <h3 className="text-xl font-heading font-semibold mb-3">
                                                {title}
                                            </h3>

                                            <p className="text-muted-foreground">
                                                {valueDescription}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-primary text-primary-foreground overflow-hidden">
                <div className="container-custom">
                    <div ref={statsRef as React.RefObject<HTMLDivElement>}
                         className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => {
                            const label = stat.label[language as keyof typeof stat.label] || stat.label.en || "";

                            return (
                                <div
                                    key={stat.id}
                                    className="transition-all duration-500 ease-out"
                                    style={{
                                        opacity: statsVisible[index] ? 1 : 0,
                                        transform: statsVisible[index] ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                                    }}
                                >
                                    <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">{stat.value}</p>
                                    <p className="text-sm opacity-80">{label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Page;