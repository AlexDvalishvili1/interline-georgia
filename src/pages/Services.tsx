import { Map, Plane, Ship, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Map,
      titleKey: "servicesPage.tours.title",
      descriptionKey: "servicesPage.tours.description",
      features: [
        "servicesPage.tours.feature1",
        "servicesPage.tours.feature2",
        "servicesPage.tours.feature3",
      ],
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
    },
    {
      icon: Plane,
      titleKey: "servicesPage.tickets.title",
      descriptionKey: "servicesPage.tickets.description",
      features: [
        "servicesPage.tickets.feature1",
        "servicesPage.tickets.feature2",
        "servicesPage.tickets.feature3",
      ],
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    },
    {
      icon: Ship,
      titleKey: "servicesPage.cruises.title",
      descriptionKey: "servicesPage.cruises.description",
      features: [
        "servicesPage.cruises.feature1",
        "servicesPage.cruises.feature2",
        "servicesPage.cruises.feature3",
      ],
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {t("servicesPage.title")}
            </h1>
            <p className="text-lg opacity-90">
              {t("servicesPage.subtitle")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Services List */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.titleKey}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className={`order-1 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden image-placeholder">
                    <img
                      src={service.image}
                      alt={t(service.titleKey)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`order-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <service.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold">
                      {t(service.titleKey)}
                    </h2>
                  </div>

                  <p className="text-muted-foreground text-lg mb-8">
                    {t(service.descriptionKey)}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+995322000000"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              +995 32 200 00 00
            </a>
            <a
              href="mailto:info@interline.ge"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-colors"
            >
              info@interline.ge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
