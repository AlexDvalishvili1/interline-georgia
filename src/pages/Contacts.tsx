import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

const Contacts = () => {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: Phone,
      titleKey: "contact.phone",
      value: "+995 32 200 00 00",
      href: "tel:+995322000000",
    },
    {
      icon: MessageCircle,
      titleKey: "contact.whatsapp",
      value: "+995 32 200 00 00",
      href: "https://wa.me/995322000000",
    },
    {
      icon: Mail,
      titleKey: "contact.email",
      value: "info@interline.ge",
      href: "mailto:info@interline.ge",
    },
    {
      icon: MapPin,
      titleKey: "contact.address",
      value: "Tbilisi, Georgia",
      href: null,
    },
    {
      icon: Clock,
      titleKey: "contact.workingHours",
      value: "Mon - Fri: 10:00 - 19:00",
      href: null,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-lg opacity-90">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <Card key={item.titleKey} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{t(item.titleKey)}</h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-accent hover:underline"
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Social Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{t("contact.followUs")}</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com/interlinegeo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={24} />
                    </a>
                    <a
                      href="https://instagram.com/interlinegeo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={24} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="space-y-4">
              <h3 className="text-xl font-heading font-semibold">{t("contact.address")}</h3>
              <div className="aspect-[4/3] rounded-xl overflow-hidden image-placeholder bg-muted">
                {/* Google Maps Embed Placeholder */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95257.67069407399!2d44.71691775!3d41.7151377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd7e64f626b%3A0x61d084ede2576ea3!2sTbilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Interline Georgia Location"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Replace with actual office address map embed
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
