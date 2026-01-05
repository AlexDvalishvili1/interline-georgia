"use client";

import {useState} from "react";
import {Search, Calendar, ArrowRight, Loader2} from "lucide-react";
import {useLanguage} from "@/contexts/LanguageContext";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {RevealSection} from "@/components/animations";
import {useStaggerReveal} from "@/hooks/useRevealOnScroll";
import {usePosts, getLocalizedField, type Post} from "@/hooks/usePosts";
import {useLocalizedPath} from "@/hooks/useLocalizedPath";
import Link from "next/link";

const Page = () => {
    const {t, language} = useLanguage();
    const lp = useLocalizedPath();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("offers");

    // Map tab to category
    const categoryMap: Record<string, string> = {
        offers: "offer",
        promotions: "promotion",
        news: "news",
    };

    const {data: posts, isLoading} = usePosts({
        displayLocation: "offers_page",
        category: categoryMap[activeTab],
        search: searchQuery,
        language,
    });

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
                <div className="container-custom">
                    <RevealSection>
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                                {t("offers.title")}
                            </h1>
                            <p className="text-lg opacity-90">
                                {t("hero.subtitle")}
                            </p>
                        </div>
                    </RevealSection>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold"/>
            </section>

            {/* Offers Grid */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    {/* Search & Tabs */}
                    <RevealSection className="mb-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div
                                className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                                <TabsList className="bg-secondary">
                                    <TabsTrigger value="offers"
                                                 className="transition-all duration-200">{t("offers.tabs.offers")}</TabsTrigger>
                                    <TabsTrigger value="promotions"
                                                 className="transition-all duration-200">{t("offers.tabs.promotions")}</TabsTrigger>
                                    <TabsTrigger value="news"
                                                 className="transition-all duration-200">{t("offers.tabs.news")}</TabsTrigger>
                                </TabsList>

                                <div className="relative w-full sm:w-64">
                                    <Search
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                    <Input
                                        placeholder={t("offers.search")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>

                            <TabsContent value="offers" className="mt-0">
                                <PostGrid posts={posts} language={language} t={t} isLoading={isLoading} lp={lp}/>
                            </TabsContent>
                            <TabsContent value="promotions" className="mt-0">
                                <PostGrid posts={posts} language={language} t={t} isLoading={isLoading} lp={lp}/>
                            </TabsContent>
                            <TabsContent value="news" className="mt-0">
                                <PostGrid posts={posts} language={language} t={t} isLoading={isLoading} lp={lp}/>
                            </TabsContent>
                        </Tabs>
                    </RevealSection>
                </div>
            </section>
        </div>
    );
};

interface PostGridProps {
    posts: Post[] | undefined;
    language: string;
    t: (key: string) => string;
    isLoading: boolean;
    lp: (path: string) => string;
}

const PostGrid = ({posts, language, t, isLoading, lp}: PostGridProps) => {
    const {containerRef, visibleItems} = useStaggerReveal(posts?.length || 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent"/>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                {t("offers.noResults")}
            </div>
        );
    }

    return (
        <div ref={containerRef as React.RefObject<HTMLDivElement>}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
                <div
                    key={post.id}
                    className="transition-all duration-500 ease-out"
                    style={{
                        opacity: visibleItems[index] ? 1 : 0,
                        transform: visibleItems[index] ? "translateY(0)" : "translateY(30px)",
                    }}
                >
                    <Link href={lp(`/offers/${post.slug}`)}>
                        <Card className="overflow-hidden hover-lift h-full group">
                            <div className="aspect-[16/10] overflow-hidden bg-muted">
                                {post.cover_image_url ? (
                                    <img
                                        src={post.cover_image_url}
                                        alt={getLocalizedField(post, "title", language)}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No image
                                    </div>
                                )}
                            </div>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 text-sm text-accent mb-2">
                                    <Calendar size={14}/>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </div>
                                <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                                    {getLocalizedField(post, "title", language)}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    {getLocalizedField(post, "excerpt", language)}
                                </p>
                                <span
                                    className="inline-flex items-center gap-1 text-accent text-sm font-medium group/link">
                  {t("offers.readMore")}
                                    <ArrowRight size={14}
                                                className="transition-transform duration-300 group-hover/link:translate-x-1"/>
                </span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Page;
