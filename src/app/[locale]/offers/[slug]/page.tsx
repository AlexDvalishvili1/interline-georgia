"use client";

import {useState} from "react";
import {ArrowLeft, Calendar, Tag, Loader2} from "lucide-react";
import {useLanguage} from "@/contexts/LanguageContext";
import {Button} from "@/components/ui/button";
import {RevealSection} from "@/components/animations";
import {useStaggerReveal} from "@/hooks/useRevealOnScroll";
import {usePost, getLocalizedField} from "@/hooks/usePosts";
import {useSiteSettings} from "@/hooks/useSiteSettings";
import {ImageLightbox} from "@/components/ui/image-lightbox";
import {useLocalizedPath} from "@/hooks/useLocalizedPath";
import Link from "next/link";
import {useParams} from "next/navigation";
import Image from "next/image";

const Page = () => {
    const {slug} = useParams<{ slug: string }>();
    const {t, language} = useLanguage();
    const lp = useLocalizedPath();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const {data: post, isLoading} = usePost(slug ?? "");
    const {data: settings} = useSiteSettings();
    const {containerRef: galleryRef, visibleItems: galleryVisible} = useStaggerReveal(post?.gallery?.length || 0);

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-accent"/>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-2xl font-heading font-bold mb-4">Post not found</h1>
                <Button asChild className="transition-all duration-300 hover:scale-105">
                    <Link href={lp("/offers")}>
                        <ArrowLeft className="mr-2" size={16}/>
                        {t("offers.title")}
                    </Link>
                </Button>
            </div>
        );
    }

    const categoryLabels: Record<string, string> = {
        offer: t("offers.tabs.offers"),
        promotion: t("offers.tabs.promotions"),
        news: t("offers.tabs.news"),
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Get contact info from settings
    const phone = settings?.phones?.[0] || settings?.phone || "";
    const whatsapp = settings?.whatsapp || phone;

    return (
        <div className="flex flex-col">
            {/* Hero Image */}
            <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-muted">
                    {post.cover_image_url ? (
                        <Image
                            src={post.cover_image_url}
                            alt={getLocalizedField(post, "title", language)}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No cover image
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"/>
                </div>
                <div className="absolute inset-0 flex items-end">
                    <div className="container-custom pb-12">
                        <RevealSection>
                            <Link
                                href={lp("/offers")}
                                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-all duration-300 hover:-translate-x-1"
                            >
                                <ArrowLeft size={16}/>
                                {t("offers.title")}
                            </Link>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-primary-foreground max-w-3xl">
                                {getLocalizedField(post, "title", language)}
                            </h1>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        {/* Meta */}
                        <RevealSection delay={100}>
                            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
                <span className="inline-flex items-center gap-2 text-sm text-accent">
                  <Tag size={14}/>
                    {categoryLabels[post.category] || post.category}
                </span>
                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14}/>
                                    {new Date(post.created_at).toLocaleDateString()}
                </span>
                            </div>
                        </RevealSection>

                        {/* Excerpt */}
                        <RevealSection delay={200}>
                            <p className="text-lg text-muted-foreground mb-8">
                                {getLocalizedField(post, "excerpt", language)}
                            </p>
                        </RevealSection>

                        {/* Content */}
                        <RevealSection delay={300}>
                            <div className="prose prose-lg max-w-none">
                                {getLocalizedField(post, "content", language).split("\n\n").map((paragraph, i) => (
                                    <p key={i} className="text-foreground mb-4 whitespace-pre-line">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </RevealSection>

                        {/* Gallery */}
                        {post.gallery && post.gallery.length > 0 && (
                            <RevealSection delay={400} className="mt-12">
                                <h3 className="text-xl font-heading font-semibold mb-6">Gallery</h3>
                                <div ref={galleryRef as React.RefObject<HTMLDivElement>}
                                     className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {post.gallery.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => openLightbox(i)}
                                            className="relative aspect-square rounded-lg overflow-hidden bg-muted group transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-accent"
                                            style={{
                                                opacity: galleryVisible[i] ? 1 : 0,
                                                transform: galleryVisible[i] ? "scale(1)" : "scale(0.95)",
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`Gallery image ${i + 1}`}
                                                fill
                                                sizes="(min-width: 768px) 33vw, 50vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </RevealSection>
                        )}

                        {/* CTA */}
                        <RevealSection delay={500} className="mt-12">
                            <div
                                className="p-8 bg-secondary rounded-xl text-center transition-all duration-300 hover:shadow-lg">
                                <h3 className="text-xl font-heading font-semibold mb-4">
                                    {t("contact.title")}
                                </h3>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {phone && (
                                        <a
                                            href={`tel:${phone.replace(/\s/g, "")}`}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        >
                                            {phone}
                                        </a>
                                    )}
                                    {whatsapp && (
                                        <a
                                            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-all duration-300 hover:scale-105"
                                        >
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </RevealSection>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            <ImageLightbox
                images={post.gallery || []}
                initialIndex={lightboxIndex}
                open={lightboxOpen}
                onOpenChange={setLightboxOpen}
            />
        </div>
    );
};

export default Page;