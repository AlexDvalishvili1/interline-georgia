import { Link } from "react-router-dom";
import { Plane, Ship, Map, Award, Globe, Headphones, Clock, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RevealSection } from "@/components/animations";
import { useStaggerReveal } from "@/hooks/useRevealOnScroll";
import { useLatestOffers, getLocalizedField } from "@/hooks/usePosts";
import { useSiteSettings, getLocalizedSettingsField, getContentField } from "@/hooks/useSiteSettings";

const Home = () => {
  const { t, language } = useLanguage();
  const { containerRef: servicesRef, visibleItems: servicesVisible } = useStaggerReveal(3);
  const { containerRef: whyUsRef, visibleItems: whyUsVisible } = useStaggerReveal(4);

  const { data: latestOffers, isLoading: offersLoading } = useLatestOffers(3);
  const { data: settings } = useSiteSettings();

  // Use stagger reveal for offers only when data is ready
  const offersReady = !offersLoading && latestOffers && latestOffers.length > 0;
  const { containerRef: offersRef, visibleItems: offersVisible } = useStaggerReveal(
    latestOffers?.length || 0,
    { ready: offersReady }
  );

  // Get content from site_content with fallback to translation keys
  const content = settings?.site_content;
  const heroTitle = getContentField(content, "home.heroTitle", language) || t("hero.title");
  const heroSubtitle = getContentField(content, "home.heroSubtitle", language) || t("hero.subtitle");
  const heroBgUrl = getContentField(content, "home.heroBgImageUrl", language) || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80";
  const servicesTitle = getContentField(content, "home.servicesTitle", language) || t("services.title");
  const servicesSubtitle = getContentField(content, "home.servicesSubtitle", language) || t("services.subtitle");
  const whyUsTitle = getContentField(content, "home.whyUsTitle", language) || t("whyUs.title");
  const latestOffersTitle = getContentField(content, "home.latestOffersTitle", language) || t("latestOffers.title");
  const contactTitle = getContentField(content, "home.contactTitle", language) || t("contact.title");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 image-placeholder bg-gradient-to-br from-primary/90 to-primary/70">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30" 
            style={{ backgroundImage: `url('${heroBgUrl}')` }}
          />
        </div>
        
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <RevealSection delay={0}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                {heroTitle}
              </h1>
            </RevealSection>
            <RevealSection delay={100}>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                {heroSubtitle}
              </p>
            </RevealSection>
            <RevealSection delay={200}>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link to="/offers">{t("hero.viewOffers")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 hover:scale-105">
                  <Link to="/contacts">{t("hero.contacts")}</Link>
                </Button>
              </div>
            </RevealSection>
          </div>
        </div>

        {/* Decorative Gold Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Services Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <RevealSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              {servicesTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {servicesSubtitle}
            </p>
          </RevealSection>

          <div ref={servicesRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tours Card */}
            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: servicesVisible[0] ? 1 : 0,
                transform: servicesVisible[0] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <Card className="hover-lift border-border/50 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Map className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {t("services.tours.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("services.tours.description")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Air Tickets Card */}
            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: servicesVisible[1] ? 1 : 0,
                transform: servicesVisible[1] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <Card className="hover-lift border-border/50 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Plane className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {t("services.tickets.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("services.tickets.description")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Cruises Card */}
            <div
              className="transition-all duration-500 ease-out"
              style={{
                opacity: servicesVisible[2] ? 1 : 0,
                transform: servicesVisible[2] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <Card className="hover-lift border-border/50 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Ship className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3">
                    {t("services.cruises.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("services.cruises.description")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              {whyUsTitle}
            </h2>
          </RevealSection>

          <div ref={whyUsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Experience */}
            <div
              className="text-center transition-all duration-500 ease-out"
              style={{
                opacity: whyUsVisible[0] ? 1 : 0,
                transform: whyUsVisible[0] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Award className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">{t("whyUs.experience.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("whyUs.experience.description")}</p>
            </div>

            {/* Worldwide */}
            <div
              className="text-center transition-all duration-500 ease-out"
              style={{
                opacity: whyUsVisible[1] ? 1 : 0,
                transform: whyUsVisible[1] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Globe className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">{t("whyUs.worldwide.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("whyUs.worldwide.description")}</p>
            </div>

            {/* Cruises Expert */}
            <div
              className="text-center transition-all duration-500 ease-out"
              style={{
                opacity: whyUsVisible[2] ? 1 : 0,
                transform: whyUsVisible[2] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Ship className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">{t("whyUs.cruises.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("whyUs.cruises.description")}</p>
            </div>

            {/* Support */}
            <div
              className="text-center transition-all duration-500 ease-out"
              style={{
                opacity: whyUsVisible[3] ? 1 : 0,
                transform: whyUsVisible[3] ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Headphones className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">{t("whyUs.support.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("whyUs.support.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <RevealSection>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold">
                {latestOffersTitle}
              </h2>
              <Button asChild variant="outline" className="transition-all duration-300 hover:scale-105">
                <Link to="/offers">{t("latestOffers.viewAll")}</Link>
              </Button>
            </div>
          </RevealSection>

          {/* Min height container to prevent layout shift */}
          <div className="min-h-[300px]">
            {offersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : latestOffers && latestOffers.length > 0 ? (
              <div ref={offersRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestOffers.map((post, index) => (
                  <div
                    key={post.id}
                    className="transition-all duration-500 ease-out"
                    style={{
                      opacity: offersVisible[index] ? 1 : 0,
                      transform: offersVisible[index] ? "translateY(0)" : "translateY(30px)",
                    }}
                  >
                    <Link to={`/offers/${post.slug}`}>
                      <Card className="overflow-hidden hover-lift group cursor-pointer h-full">
                        <div className="aspect-[16/10] overflow-hidden bg-muted">
                          {post.cover_image_url ? (
                            <img
                              src={post.cover_image_url}
                              alt={getLocalizedField(post, "title", language)}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 text-sm text-accent mb-2">
                            <Calendar size={14} />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                            {getLocalizedField(post, "title", language)}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {getLocalizedField(post, "excerpt", language)}
                          </p>
                          <span className="inline-flex items-center gap-1 text-accent text-sm font-medium mt-3 group/link">
                            {t("offers.readMore")}
                            <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {t("offers.noResults")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <RevealSection direction="left">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {contactTitle}
              </h2>
              
              <div className="space-y-6">
                {/* All Phones */}
                {settings?.phones && settings.phones.length > 0 && (
                  <div className="group">
                    <h4 className="font-semibold mb-1">{t("contact.phone")}</h4>
                    <div className="flex flex-col gap-1">
                      {settings.phones.map((phone, idx) => (
                        <a key={idx} href={`tel:${phone.replace(/\s/g, "")}`} className="text-accent hover:underline transition-colors">
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {settings?.whatsapp && (
                  <div className="group">
                    <h4 className="font-semibold mb-1">{t("contact.whatsapp")}</h4>
                    <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} className="text-accent hover:underline transition-colors">
                      {settings.whatsapp}
                    </a>
                  </div>
                )}
                {settings?.emails && settings.emails.length > 0 && (
                  <div className="group">
                    <h4 className="font-semibold mb-1">{t("contact.email")}</h4>
                    <div className="flex flex-col gap-1">
                      {settings.emails.map((email, idx) => (
                        <a key={idx} href={`mailto:${email}`} className="text-accent hover:underline transition-colors">
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">{t("contact.address")}</h4>
                  <p className="text-muted-foreground">
                    {getLocalizedSettingsField(settings, "address", language) || "Tbilisi, Georgia"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t("contact.workingHours")}</h4>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Clock size={16} />
                    {getLocalizedSettingsField(settings, "working_hours", language) || "Mon - Fri: 10:00 - 19:00"}
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* Map */}
            <RevealSection direction="right" delay={200}>
              <div className="aspect-[4/3] lg:aspect-auto rounded-lg overflow-hidden bg-muted min-h-[300px]">
                {settings?.map_embed_url ? (
                  <iframe
                    src={settings.map_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Map will be embedded here
                  </div>
                )}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
