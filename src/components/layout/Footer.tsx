import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-heading font-bold">Interline</span>
              <span className="block text-xs uppercase tracking-widest opacity-70">
                Georgia
              </span>
            </Link>
            <p className="text-sm opacity-80">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("nav.home")}</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/offers" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.offers")}
              </Link>
              <Link to="/services" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.services")}
              </Link>
              <Link to="/about" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.about")}
              </Link>
              <Link to="/contacts" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                {t("nav.contacts")}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("contact.title")}</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+995322000000" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={16} />
                +995 32 200 00 00
              </a>
              <a href="mailto:info@interline.ge" className="flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Mail size={16} />
                info@interline.ge
              </a>
              <div className="flex items-start gap-2 text-sm opacity-80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Tbilisi, Georgia</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("contact.followUs")}</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/interlinegeo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com/interlinegeo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/10">
          <p className="text-sm text-center opacity-70">
            © {currentYear} {t("footer.company")}. {t("footer.rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
};
