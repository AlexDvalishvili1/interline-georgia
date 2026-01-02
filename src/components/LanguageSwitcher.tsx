import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { languageToUrlLocale, type UrlLocale } from "@/hooks/useLocalizedPath";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// URL locale codes for display
const languages: { urlCode: UrlLocale; label: string; flag: string; shortCode: string }[] = [
  { urlCode: "ge", label: "ქართული", flag: "🇬🇪", shortCode: "GE" },
  { urlCode: "ru", label: "Русский", flag: "🇷🇺", shortCode: "RU" },
  { urlCode: "en", label: "English", flag: "🇬🇧", shortCode: "EN" },
];

export const LanguageSwitcher = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useParams<{ locale: string }>();
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Get current URL locale
  const currentUrlLocale = locale || languageToUrlLocale(language);
  const currentLang = languages.find((l) => l.urlCode === currentUrlLocale) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen) {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % languages.length);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + languages.length) % languages.length);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedIndex >= 0) {
            handleSelect(languages[focusedIndex].urlCode);
          }
          break;
        case "Tab":
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [isOpen, focusedIndex]
  );

  const handleSelect = (newUrlLocale: UrlLocale) => {
    // Get the path after the current locale (preserving the entire path including slugs)
    // Replace only the first segment (the locale) in the pathname
    const pathWithoutLocale = location.pathname.replace(/^\/(ge|ru|en)/, "") || "";
    
    // Navigate to the new locale with the preserved path
    navigate(`/${newUrlLocale}${pathWithoutLocale}${location.search}`);
    
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
          "bg-secondary hover:bg-secondary/80 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="text-base" aria-hidden="true">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <ChevronDown
          size={16}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute right-0 mt-2 w-40 py-1 rounded-lg shadow-lg z-50",
          "bg-popover border border-border",
          "origin-top-right transition-all duration-200",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
        role="listbox"
        aria-label="Language options"
        onKeyDown={handleKeyDown}
      >
        {languages.map((lang, index) => (
          <button
            key={lang.urlCode}
            onClick={() => handleSelect(lang.urlCode)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
              "focus:outline-none",
              currentUrlLocale === lang.urlCode
                ? "bg-accent/10 text-accent"
                : "text-foreground hover:bg-muted",
              focusedIndex === index && "bg-muted"
            )}
            role="option"
            aria-selected={currentUrlLocale === lang.urlCode}
            tabIndex={-1}
          >
            <span className="text-base" aria-hidden="true">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
