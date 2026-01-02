import { useEffect } from "react";
import { useParams, Outlet, Navigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { urlLocaleToLanguage, isValidLocale } from "@/hooks/useLocalizedPath";

/**
 * LocaleWrapper component that:
 * 1. Reads the locale from URL params
 * 2. Validates the locale (ge, ru, en)
 * 3. Syncs the URL locale with LanguageContext
 * 4. Redirects invalid locales to /ge
 */
export const LocaleWrapper = () => {
  const { locale } = useParams<{ locale: string }>();
  const location = useLocation();
  const { setLanguage, language } = useLanguage();

  // Validate locale
  if (!locale || !isValidLocale(locale)) {
    // Preserve the path after the invalid locale
    const pathAfterLocale = location.pathname.replace(/^\/[^/]*/, "");
    return <Navigate to={`/ge${pathAfterLocale}`} replace />;
  }

  // Sync URL locale with language context
  useEffect(() => {
    const internalLanguage = urlLocaleToLanguage(locale);
    if (language !== internalLanguage) {
      setLanguage(internalLanguage);
    }
  }, [locale, setLanguage, language]);

  return <Outlet />;
};
