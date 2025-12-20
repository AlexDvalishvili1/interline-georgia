import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Placeholder data - will be replaced with database in Phase 2
const placeholderPosts = [
  {
    id: "1",
    slug: "summer-cruise-mediterranean",
    category: "offer",
    title: {
      ka: "ხმელთაშუა ზღვის საზაფხულო კრუიზი",
      ru: "Летний круиз по Средиземному морю",
      en: "Summer Mediterranean Cruise",
    },
    excerpt: {
      ka: "აღმოაჩინეთ ხმელთაშუა ზღვის ულამაზესი კუნძულები და ნავსადგურები ჩვენი ექსკლუზიური კრუიზით.",
      ru: "Откройте для себя красивейшие острова и порты Средиземного моря в нашем эксклюзивном круизе.",
      en: "Discover the most beautiful islands and ports of the Mediterranean with our exclusive cruise.",
    },
    createdAt: "2024-12-15",
    coverImageUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80",
  },
  {
    id: "2",
    slug: "dubai-tour-package",
    category: "offer",
    title: {
      ka: "დუბაის ტურ-პაკეტი",
      ru: "Турпакет в Дубай",
      en: "Dubai Tour Package",
    },
    excerpt: {
      ka: "5 ღამე დუბაიში ყველაფრის ჩათვლით - სასტუმრო, ტრანსფერი, ექსკურსიები.",
      ru: "5 ночей в Дубае с полным пакетом - отель, трансфер, экскурсии.",
      en: "5 nights in Dubai all-inclusive - hotel, transfer, excursions.",
    },
    createdAt: "2024-12-10",
    coverImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  },
  {
    id: "3",
    slug: "early-booking-discount",
    category: "promotion",
    title: {
      ka: "ადრეული დაჯავშნის ფასდაკლება",
      ru: "Скидка за раннее бронирование",
      en: "Early Booking Discount",
    },
    excerpt: {
      ka: "დაჯავშნეთ 2025 წლის ზაფხულის ტური ახლავე და მიიღეთ 15% ფასდაკლება!",
      ru: "Забронируйте летний тур 2025 сейчас и получите скидку 15%!",
      en: "Book your Summer 2025 tour now and get 15% discount!",
    },
    createdAt: "2024-12-08",
    coverImageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80",
  },
  {
    id: "4",
    slug: "group-travel-special",
    category: "promotion",
    title: {
      ka: "ჯგუფური მოგზაურობის სპეციალური შეთავაზება",
      ru: "Специальное предложение для групп",
      en: "Group Travel Special Offer",
    },
    excerpt: {
      ka: "10+ ადამიანის ჯგუფისთვის განსაკუთრებული ფასები და პირობები.",
      ru: "Особые цены и условия для групп от 10 человек.",
      en: "Special prices and conditions for groups of 10+ people.",
    },
    createdAt: "2024-12-05",
    coverImageUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80",
  },
  {
    id: "5",
    slug: "new-cruise-destinations-2025",
    category: "news",
    title: {
      ka: "ახალი კრუიზის მიმართულებები 2025",
      ru: "Новые направления круизов 2025",
      en: "New Cruise Destinations 2025",
    },
    excerpt: {
      ka: "გაეცანით ჩვენს ახალ კრუიზულ მარშრუტებს 2025 წლისთვის.",
      ru: "Ознакомьтесь с нашими новыми круизными маршрутами на 2025 год.",
      en: "Check out our new cruise routes for 2025.",
    },
    createdAt: "2024-12-01",
    coverImageUrl: "https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=600&q=80",
  },
  {
    id: "6",
    slug: "partner-airlines-expansion",
    category: "news",
    title: {
      ka: "პარტნიორი ავიაკომპანიების გაფართოება",
      ru: "Расширение партнерских авиакомпаний",
      en: "Partner Airlines Expansion",
    },
    excerpt: {
      ka: "ჩვენ დავამატეთ 5 ახალი ავიაკომპანია ჩვენს პარტნიორთა ქსელში.",
      ru: "Мы добавили 5 новых авиакомпаний в нашу партнерскую сеть.",
      en: "We added 5 new airlines to our partner network.",
    },
    createdAt: "2024-11-28",
    coverImageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
  },
];

const Offers = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("offers");

  const filteredPosts = placeholderPosts.filter((post) => {
    const matchesCategory =
      (activeTab === "offers" && post.category === "offer") ||
      (activeTab === "promotions" && post.category === "promotion") ||
      (activeTab === "news" && post.category === "news");

    const title = post.title[language as keyof typeof post.title];
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {t("offers.title")}
            </h1>
            <p className="text-lg opacity-90">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Offers Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {/* Search & Tabs */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="offers">{t("offers.tabs.offers")}</TabsTrigger>
                  <TabsTrigger value="promotions">{t("offers.tabs.promotions")}</TabsTrigger>
                  <TabsTrigger value="news">{t("offers.tabs.news")}</TabsTrigger>
                </TabsList>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("offers.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <TabsContent value="offers" className="mt-0">
                <PostGrid posts={filteredPosts} language={language} t={t} />
              </TabsContent>
              <TabsContent value="promotions" className="mt-0">
                <PostGrid posts={filteredPosts} language={language} t={t} />
              </TabsContent>
              <TabsContent value="news" className="mt-0">
                <PostGrid posts={filteredPosts} language={language} t={t} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
};

interface PostGridProps {
  posts: typeof placeholderPosts;
  language: string;
  t: (key: string) => string;
}

const PostGrid = ({ posts, language, t }: PostGridProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t("offers.noResults")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link key={post.id} to={`/offers/${post.slug}`}>
          <Card className="overflow-hidden hover-lift h-full">
            <div className="aspect-[16/10] image-placeholder">
              <img
                src={post.coverImageUrl}
                alt={post.title[language as keyof typeof post.title]}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm text-accent mb-2">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2">
                {post.title[language as keyof typeof post.title]}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {post.excerpt[language as keyof typeof post.excerpt]}
              </p>
              <span className="inline-flex items-center gap-1 text-accent text-sm font-medium group">
                {t("offers.readMore")}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default Offers;
