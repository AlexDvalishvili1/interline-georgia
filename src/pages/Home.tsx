import { Link } from "react-router-dom";
import { Plane, Ship, Map, Award, Globe, Headphones, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RevealSection } from "@/components/animations";
import { useStaggerReveal } from "@/hooks/useRevealOnScroll";

const Home = () => {
  const { t } = useLanguage();
  const { containerRef: servicesRef, visibleItems: servicesVisible } = useStaggerReveal(3);
  const { containerRef: whyUsRef, visibleItems: whyUsVisible } = useStaggerReveal(4);
  const { containerRef: offersRef, visibleItems: offersVisible } = useStaggerReveal(3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 image-placeholder bg-gradient-to-br from-primary/90 to-primary/70">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')] bg-cover bg-center opacity-30" />
        </div>
        
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <RevealSection delay={0}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                {t("hero.title")}
              </h1>
            </RevealSection>
            <RevealSection delay={100}>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                {t("hero.subtitle")}
              </p>
            </RevealSection>
            <RevealSection delay={200}>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link to="/offers">{t("hero.viewOffers")}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105">
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
              {t("services.title")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("services.subtitle")}
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
              {t("whyUs.title")}
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
                {t("latestOffers.title")}
              </h2>
              <Button asChild variant="outline" className="transition-all duration-300 hover:scale-105">
                <Link to="/offers">{t("latestOffers.viewAll")}</Link>
              </Button>
            </div>
          </RevealSection>

          {/* Placeholder for dynamic content */}
          <div ref={offersRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i, index) => (
              <div
                key={i}
                className="transition-all duration-500 ease-out"
                style={{
                  opacity: offersVisible[index] ? 1 : 0,
                  transform: offersVisible[index] ? "translateY(0)" : "translateY(30px)",
                }}
              >
                <Card className="overflow-hidden hover-lift group cursor-pointer">
                  <div className="aspect-[16/10] image-placeholder bg-muted overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <CardContent className="p-6">
                    <p className="text-sm text-accent mb-2">Offer</p>
                    <h3 className="font-heading font-semibold text-lg mb-2">
                      {t("latestOffers.comingSoon")}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Phase 2 will connect this to the database.
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <RevealSection direction="left">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {t("contact.title")}
              </h2>
              
              <div className="space-y-6">
                <div className="group">
                  <h4 className="font-semibold mb-1">{t("contact.phone")}</h4>
                  <a href="tel:+995322000000" className="text-accent hover:underline transition-colors">
                    +995 32 200 00 00
                  </a>
                </div>
                <div className="group">
                  <h4 className="font-semibold mb-1">{t("contact.whatsapp")}</h4>
                  <a href="https://wa.me/995322000000" className="text-accent hover:underline transition-colors">
                    +995 32 200 00 00
                  </a>
                </div>
                <div className="group">
                  <h4 className="font-semibold mb-1">{t("contact.email")}</h4>
                  <a href="mailto:info@interline.ge" className="text-accent hover:underline transition-colors">
                    info@interline.ge
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t("contact.address")}</h4>
                  <p className="text-muted-foreground">Tbilisi, Georgia</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t("contact.workingHours")}</h4>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Clock size={16} />
                    Mon - Fri: 10:00 - 19:00
                  </p>
                </div>
              </div>
            </RevealSection>

            {/* Map Placeholder */}
            <RevealSection direction="right" delay={200}>
              <div className="aspect-[4/3] lg:aspect-auto rounded-lg overflow-hidden image-placeholder bg-muted min-h-[300px]">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Map will be embedded here
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
