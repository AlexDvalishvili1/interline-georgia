import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { RevealSection } from "@/components/animations";
import { useStaggerReveal } from "@/hooks/useRevealOnScroll";
import { useSiteSettings, getLocalizedSettingsField } from "@/hooks/useSiteSettings";

// TikTok icon component
const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
);

const Contacts = () => {
  const { t, language } = useLanguage();
  const { data: settings, isLoading } = useSiteSettings();
  const { containerRef: cardsRef, visibleItems: cardsVisible } = useStaggerReveal(6);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Build contact info from settings
  const contactInfo = [];

  // Phones
  if (settings?.phones && settings.phones.length > 0) {
    contactInfo.push({
      icon: Phone,
      titleKey: "contact.phone",
      values: settings.phones,
      hrefPrefix: "tel:",
      formatHref: (v: string) => v.replace(/\s/g, ""),
    });
  }

  // WhatsApp
  if (settings?.whatsapp) {
    contactInfo.push({
      icon: MessageCircle,
      titleKey: "contact.whatsapp",
      values: [settings.whatsapp],
      hrefPrefix: "https://wa.me/",
      formatHref: (v: string) => v.replace(/[^0-9]/g, ""),
      external: true,
    });
  }

  // Emails
  if (settings?.emails && settings.emails.length > 0) {
    contactInfo.push({
      icon: Mail,
      titleKey: "contact.email",
      values: settings.emails,
      hrefPrefix: "mailto:",
      formatHref: (v: string) => v,
    });
  }

  // Address
  const address = getLocalizedSettingsField(settings, "address", language);
  if (address) {
    contactInfo.push({
      icon: MapPin,
      titleKey: "contact.address",
      values: [address],
      hrefPrefix: null,
    });
  }

  // Working Hours
  const workingHours = getLocalizedSettingsField(settings, "working_hours", language);
  if (workingHours) {
    contactInfo.push({
      icon: Clock,
      titleKey: "contact.workingHours",
      values: [workingHours],
      hrefPrefix: null,
    });
  }

  // Social links
  const socialLinks = [];
  if (settings?.facebook_url) {
    socialLinks.push({ icon: Facebook, url: settings.facebook_url, label: "Facebook" });
  }
  if (settings?.instagram_url) {
    socialLinks.push({ icon: Instagram, url: settings.instagram_url, label: "Instagram" });
  }
  if (settings?.tiktok_url) {
    socialLinks.push({ icon: TikTokIcon, url: settings.tiktok_url, label: "TikTok" });
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container-custom">
          <RevealSection>
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                {t("contact.title")}
              </h1>
              <p className="text-lg opacity-90">
                {t("hero.subtitle")}
              </p>
            </div>
          </RevealSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div ref={cardsRef as React.RefObject<HTMLDivElement>} className="space-y-6">
              {contactInfo.map((item, index) => (
                <div
                  key={item.titleKey}
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: cardsVisible[index] ? 1 : 0,
                    transform: cardsVisible[index] ? "translateX(0)" : "translateX(-30px)",
                  }}
                >
                  <Card className="hover-lift group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                          <item.icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{t(item.titleKey)}</h3>
                          <div className="flex flex-col gap-1">
                            {item.values.map((value: string, idx: number) =>
                              item.hrefPrefix ? (
                                <a
                                  key={idx}
                                  href={`${item.hrefPrefix}${item.formatHref ? item.formatHref(value) : value}`}
                                  className="text-accent hover:underline transition-colors"
                                  target={item.external ? "_blank" : undefined}
                                  rel={item.external ? "noopener noreferrer" : undefined}
                                >
                                  {value}
                                </a>
                              ) : (
                                <p key={idx} className="text-muted-foreground">{value}</p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: cardsVisible[contactInfo.length] ? 1 : 0,
                    transform: cardsVisible[contactInfo.length] ? "translateX(0)" : "translateX(-30px)",
                  }}
                >
                  <Card className="group">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">{t("contact.followUs")}</h3>
                      <div className="flex gap-4">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            aria-label={social.label}
                          >
                            <social.icon size={24} />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Map */}
            <RevealSection direction="right" delay={200}>
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-semibold">{t("contact.address")}</h3>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
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
                      Map will be embedded after adding in settings
                    </div>
                  )}
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacts;
