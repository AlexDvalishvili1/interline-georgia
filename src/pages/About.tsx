import { Award, Heart, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const { t } = useLanguage();

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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {t("about.title")}
            </h1>
            <p className="text-lg opacity-90">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="aspect-[4/3] rounded-xl overflow-hidden image-placeholder">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                alt="Interline Georgia Team"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Content */}
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("about.description")}
              </p>

              <div className="p-6 bg-secondary rounded-xl">
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {t("about.mission")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.missionText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            {t("about.values")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <Card key={value.titleKey} className="hover-lift">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
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
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">20+</p>
              <p className="text-sm opacity-80">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">5000+</p>
              <p className="text-sm opacity-80">Cruise Routes</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">100+</p>
              <p className="text-sm opacity-80">Destinations</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-heading font-bold text-gold mb-2">10K+</p>
              <p className="text-sm opacity-80">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
