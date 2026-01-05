"use client";

import {createContext, useContext, useState, useEffect, ReactNode} from "react";

export type Language = "ka" | "ru" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({children}) => {
    // Initialize with ka (Georgian) as default - URL will override this via LocaleWrapper
    const [language, setLanguageState] = useState<Language>("ka");

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        // Still store in localStorage for initial page load before URL is parsed
        localStorage.setItem("interline-language", lang);
        document.documentElement.lang = lang === "ka" ? "ge" : lang;
    };

    useEffect(() => {
        document.documentElement.lang = language === "ka" ? "ge" : language;
    }, [language]);

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        // Fallback to English if translation not found
        if (!value) {
            let fallback: any = translations.en;
            for (const k of keys) {
                fallback = fallback?.[k];
            }
            return fallback || key;
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{language, setLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

const translations = {
    ka: {
        nav: {
            home: "მთავარი",
            offers: "შეთავაზებები",
            services: "სერვისები",
            about: "ჩვენს შესახებ",
            contacts: "კონტაქტი",
        },
        hero: {
            title: "აღმოაჩინეთ სამყარო ჩვენთან ერთად",
            subtitle: "გამოცდილება 2005 წლიდან - თქვენი სანდო პარტნიორი მოგზაურობაში",
            viewOffers: "შეთავაზებები",
            contacts: "კონტაქტი",
        },
        services: {
            title: "ჩვენი სერვისები",
            subtitle: "პროფესიონალური მომსახურება ყველა მიმართულებით",
            tours: {
                title: "ტურები",
                description: "ინდივიდუალური და ჯგუფური ტურები მსოფლიოს ნებისმიერ წერტილში",
            },
            tickets: {
                title: "ავიაბილეთები",
                description: "საუკეთესო ფასები ყველა მიმართულებაზე, სწრაფი დაჯავშნა",
            },
            cruises: {
                title: "კრუიზები",
                description: "5000+ მარშრუტი - ოკეანეების და ზღვების მოგზაურობა",
            },
        },
        whyUs: {
            title: "რატომ Interline?",
            experience: {
                title: "გამოცდილება 2005 წლიდან",
                description: "20 წელზე მეტი გამოცდილება ტურიზმის სფეროში",
            },
            worldwide: {
                title: "მსოფლიო მასშტაბით",
                description: "მოგზაურობა ნებისმიერ მიმართულებით",
            },
            cruises: {
                title: "კრუიზების ექსპერტი",
                description: "5000+ კრუიზის მარშრუტი",
            },
            support: {
                title: "პროფესიონალური მხარდაჭერა",
                description: "24/7 კლიენტის მომსახურება",
            },
        },
        latestOffers: {
            title: "უახლესი შეთავაზებები",
            viewAll: "ყველა შეთავაზება",
            comingSoon: "მალე დაემატება...",
        },
        contact: {
            title: "დაგვიკავშირდით",
            phone: "ტელეფონი",
            whatsapp: "WhatsApp",
            email: "ელ-ფოსტა",
            address: "მისამართი",
            workingHours: "სამუშაო საათები",
            followUs: "გამოგვყევით",
        },
        footer: {
            rights: "ყველა უფლება დაცულია",
            company: "Interline Georgia",
        },
        about: {
            title: "ჩვენს შესახებ",
            subtitle: "თქვენი სანდო პარტნიორი მოგზაურობაში",
            description: "Interline Georgia 2005 წლიდან წარმატებით ემსახურება მოგზაურობის მოყვარულებს. ჩვენ გთავაზობთ სრულ სპექტრს სატურისტო მომსახურებისა, მათ შორის ინდივიდუალურ და ჯგუფურ ტურებს, ავიაბილეთების დაჯავშნას და კრუიზებს მსოფლიოს ყველა წამყვან კომპანიასთან თანამშრომლობით.",
            mission: "ჩვენი მისია",
            missionText: "თითოეული კლიენტისთვის დაუვიწყარი მოგზაურობის შექმნა, პროფესიონალური მომსახურებითა და ინდივიდუალური მიდგომით.",
            values: "ჩვენი ღირებულებები",
            trust: "ნდობა",
            trustText: "20 წელზე მეტი ხნის განმავლობაში ჩვენ ვქმნით გრძელვადიან ურთიერთობებს ჩვენს კლიენტებთან.",
            quality: "ხარისხი",
            qualityText: "მხოლოდ საუკეთესო პარტნიორებთან თანამშრომლობა და მაღალი სტანდარტების დაცვა.",
            care: "ზრუნვა",
            careText: "თითოეული კლიენტი ჩვენთვის განსაკუთრებულია.",
        },
        servicesPage: {
            title: "ჩვენი სერვისები",
            subtitle: "სრული სპექტრი სატურისტო მომსახურებისა",
            tours: {
                title: "ტურები",
                description: "ჩვენ გთავაზობთ მოგზაურობას მსოფლიოს ყველაზე საინტერესო მიმართულებებით. ინდივიდუალური ტურები თქვენი სურვილების მიხედვით ან ჯგუფური მოგზაურობა - თქვენ ირჩევთ, ჩვენ ვახორციელებთ.",
                feature1: "ინდივიდუალური ტურები",
                feature2: "ჯგუფური მოგზაურობა",
                feature3: "VIP მომსახურება",
            },
            tickets: {
                title: "ავიაბილეთები",
                description: "სწრაფი და მოსახერხებელი ავიაბილეთების დაჯავშნა მსოფლიოს ყველა მიმართულებით. თანამშრომლობა ყველა წამყვან ავიაკომპანიასთან საუკეთესო ფასებით.",
                feature1: "ონლაინ დაჯავშნა",
                feature2: "საუკეთესო ფასები",
                feature3: "ყველა ავიაკომპანია",
            },
            cruises: {
                title: "კრუიზები",
                description: "ოცნების მოგზაურობა ზღვებსა და ოკეანეებზე. 5000-ზე მეტი მარშრუტი მსოფლიოს საუკეთესო კრუიზულ კომპანიებთან თანამშრომლობით.",
                feature1: "5000+ მარშრუტი",
                feature2: "ლუქსი გემები",
                feature3: "ექსკლუზიური შეთავაზებები",
            },
        },
        offers: {
            title: "შეთავაზებები და აქციები",
            tabs: {
                offers: "შეთავაზებები",
                promotions: "აქციები",
                news: "სიახლეები",
            },
            search: "ძიება...",
            readMore: "ვრცლად",
            noResults: "შეთავაზებები ვერ მოიძებნა",
        },
    },
    ru: {
        nav: {
            home: "Главная",
            offers: "Предложения",
            services: "Услуги",
            about: "О нас",
            contacts: "Контакты",
        },
        hero: {
            title: "Откройте мир вместе с нами",
            subtitle: "Опыт с 2005 года - ваш надежный партнер в путешествиях",
            viewOffers: "Предложения",
            contacts: "Контакты",
        },
        services: {
            title: "Наши услуги",
            subtitle: "Профессиональный сервис во всех направлениях",
            tours: {
                title: "Туры",
                description: "Индивидуальные и групповые туры в любую точку мира",
            },
            tickets: {
                title: "Авиабилеты",
                description: "Лучшие цены на все направления, быстрое бронирование",
            },
            cruises: {
                title: "Круизы",
                description: "5000+ маршрутов - путешествия по океанам и морям",
            },
        },
        whyUs: {
            title: "Почему Interline?",
            experience: {
                title: "Опыт с 2005 года",
                description: "Более 20 лет опыта в сфере туризма",
            },
            worldwide: {
                title: "По всему миру",
                description: "Путешествия в любом направлении",
            },
            cruises: {
                title: "Эксперт по круизам",
                description: "5000+ круизных маршрутов",
            },
            support: {
                title: "Профессиональная поддержка",
                description: "Обслуживание клиентов 24/7",
            },
        },
        latestOffers: {
            title: "Последние предложения",
            viewAll: "Все предложения",
            comingSoon: "Скоро появятся...",
        },
        contact: {
            title: "Свяжитесь с нами",
            phone: "Телефон",
            whatsapp: "WhatsApp",
            email: "Эл. почта",
            address: "Адрес",
            workingHours: "Рабочие часы",
            followUs: "Следите за нами",
        },
        footer: {
            rights: "Все права защищены",
            company: "Interline Georgia",
        },
        about: {
            title: "О нас",
            subtitle: "Ваш надежный партнер в путешествиях",
            description: "Interline Georgia с 2005 года успешно обслуживает любителей путешествий. Мы предлагаем полный спектр туристических услуг, включая индивидуальные и групповые туры, бронирование авиабилетов и круизы в сотрудничестве со всеми ведущими компаниями мира.",
            mission: "Наша миссия",
            missionText: "Создание незабываемых путешествий для каждого клиента с профессиональным сервисом и индивидуальным подходом.",
            values: "Наши ценности",
            trust: "Доверие",
            trustText: "Более 20 лет мы строим долгосрочные отношения с нашими клиентами.",
            quality: "Качество",
            qualityText: "Сотрудничество только с лучшими партнерами и соблюдение высоких стандартов.",
            care: "Забота",
            careText: "Каждый клиент для нас особенный.",
        },
        servicesPage: {
            title: "Наши услуги",
            subtitle: "Полный спектр туристических услуг",
            tours: {
                title: "Туры",
                description: "Мы предлагаем путешествия по самым интересным направлениям мира. Индивидуальные туры по вашим пожеланиям или групповые путешествия - вы выбираете, мы реализуем.",
                feature1: "Индивидуальные туры",
                feature2: "Групповые путешествия",
                feature3: "VIP обслуживание",
            },
            tickets: {
                title: "Авиабилеты",
                description: "Быстрое и удобное бронирование авиабилетов по всем направлениям мира. Сотрудничество со всеми ведущими авиакомпаниями по лучшим ценам.",
                feature1: "Онлайн бронирование",
                feature2: "Лучшие цены",
                feature3: "Все авиакомпании",
            },
            cruises: {
                title: "Круизы",
                description: "Путешествие мечты по морям и океанам. Более 5000 маршрутов в сотрудничестве с лучшими круизными компаниями мира.",
                feature1: "5000+ маршрутов",
                feature2: "Люксовые лайнеры",
                feature3: "Эксклюзивные предложения",
            },
        },
        offers: {
            title: "Предложения и акции",
            tabs: {
                offers: "Предложения",
                promotions: "Акции",
                news: "Новости",
            },
            search: "Поиск...",
            readMore: "Подробнее",
            noResults: "Предложения не найдены",
        },
    },
    en: {
        nav: {
            home: "Home",
            offers: "Offers",
            services: "Services",
            about: "About",
            contacts: "Contacts",
        },
        hero: {
            title: "Discover the World With Us",
            subtitle: "Experience since 2005 - Your trusted travel partner",
            viewOffers: "View Offers",
            contacts: "Contacts",
        },
        services: {
            title: "Our Services",
            subtitle: "Professional service in all directions",
            tours: {
                title: "Tours",
                description: "Individual and group tours to any destination in the world",
            },
            tickets: {
                title: "Air Tickets",
                description: "Best prices on all destinations, fast booking",
            },
            cruises: {
                title: "Cruises",
                description: "5000+ routes - ocean and sea voyages",
            },
        },
        whyUs: {
            title: "Why Interline?",
            experience: {
                title: "Experience since 2005",
                description: "Over 20 years of experience in tourism",
            },
            worldwide: {
                title: "Worldwide",
                description: "Travel in any direction",
            },
            cruises: {
                title: "Cruise Expert",
                description: "5000+ cruise routes",
            },
            support: {
                title: "Professional Support",
                description: "24/7 customer service",
            },
        },
        latestOffers: {
            title: "Latest Offers",
            viewAll: "View All Offers",
            comingSoon: "Coming soon...",
        },
        contact: {
            title: "Contact Us",
            phone: "Phone",
            whatsapp: "WhatsApp",
            email: "Email",
            address: "Address",
            workingHours: "Working Hours",
            followUs: "Follow Us",
        },
        footer: {
            rights: "All rights reserved",
            company: "Interline Georgia",
        },
        about: {
            title: "About Us",
            subtitle: "Your trusted travel partner",
            description: "Interline Georgia has been successfully serving travel enthusiasts since 2005. We offer a full range of tourism services, including individual and group tours, flight bookings, and cruises in cooperation with all leading companies worldwide.",
            mission: "Our Mission",
            missionText: "Creating unforgettable journeys for every client with professional service and individual approach.",
            values: "Our Values",
            trust: "Trust",
            trustText: "For over 20 years, we have been building long-term relationships with our clients.",
            quality: "Quality",
            qualityText: "Cooperation only with the best partners and maintaining high standards.",
            care: "Care",
            careText: "Every client is special to us.",
        },
        servicesPage: {
            title: "Our Services",
            subtitle: "Full range of tourism services",
            tours: {
                title: "Tours",
                description: "We offer travel to the most interesting destinations in the world. Individual tours tailored to your wishes or group travel - you choose, we deliver.",
                feature1: "Individual Tours",
                feature2: "Group Travel",
                feature3: "VIP Service",
            },
            tickets: {
                title: "Air Tickets",
                description: "Fast and convenient flight booking to all destinations worldwide. Cooperation with all leading airlines at the best prices.",
                feature1: "Online Booking",
                feature2: "Best Prices",
                feature3: "All Airlines",
            },
            cruises: {
                title: "Cruises",
                description: "Dream voyage across seas and oceans. Over 5000 routes in cooperation with the world's best cruise companies.",
                feature1: "5000+ Routes",
                feature2: "Luxury Liners",
                feature3: "Exclusive Offers",
            },
        },
        offers: {
            title: "Offers & Promotions",
            tabs: {
                offers: "Offers",
                promotions: "Promotions",
                news: "News",
            },
            search: "Search...",
            readMore: "Read More",
            noResults: "No offers found",
        },
    },
};
