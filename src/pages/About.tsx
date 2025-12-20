import { Award, Heart, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { RevealSection } from "@/components/animations";
import { useStaggerReveal } from "@/hooks/useRevealOnScroll";

const About = () => {
  const { t } = useLanguage();
  const { containerRef: valuesRef, visibleItems: valuesVisible } = useStaggerReveal(3);
  const { containerRef: statsRef, visibleItems: statsVisible } = useStaggerReveal(4);

  const values = [
    {
      icon: Award,
      titleKey: "about.trust",
      descriptionKey: "about.trustText",
    },
    {
      icon: Star,
      titleKey: "about.quality",
      descriptionKey: "about.qualityText",
    },
    {
      icon: Heart,
      titleKey: "about.care",
      descriptionKey: "about.careText",
    },
  ];

  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "5000+", label: "Cruise Routes" },
    { value: "100+", label: "Destinations" },
    { value: "10K+", label: "Happy Clients" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container-custom">
          <RevealSection>
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                {t("about.title")}
              </h1>
              <p className="text-lg opacity-90">
                {t("about.subtitle")}
              </p>
            </div>
          </RevealSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <RevealSection direction="left">
              <div className="aspect-[4/3] rounded-xl overflow-hidden image-placeholder group">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                  alt="Interline Georgia Team"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </RevealSection>

            {/* Text Content */}
            <RevealSection direction="right" delay={100}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("about.description")}
              </p>

              <div className="p-6 bg-secondary rounded-xl transition-all duration-300 hover:shadow-lg">
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {t("about.mission")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.missionText")}
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
              {t("about.values")}
            </h2>
          </RevealSection>

          <div ref={valuesRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={value.titleKey}
                className="transition-all duration-500 ease-out"
                style={{
                  opacity: valuesVisible[index] ? 1 : 0,
                  transform: valuesVisible[index] ? "translateY(0)" : "translateY(30px)",
                }}
              >
                <Card className="hover-lift group">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <value.icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-3">
                      {t(value.titleKey)}
                    </h3>
                    <p className="text-muted-foreground">
                      {t(value.descriptionKey)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground overflow-hidden">
        <div className="container-custom">
          <div ref={statsRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="transition-all duration-500 ease-out"
                style={{
                  opacity: statsVisible[index] ? 1 : 0,
                  transform: statsVisible[index] ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                }}
              >
                <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
