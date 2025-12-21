import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Localized field structure for site content
export interface LocalizedField {
  ka?: string;
  ru?: string;
  en?: string;
}

// Site content structure for all pages
export interface SiteContent {
  home?: {
    heroTitle?: LocalizedField;
    heroSubtitle?: LocalizedField;
    heroBgImageUrl?: string;
    servicesTitle?: LocalizedField;
    servicesSubtitle?: LocalizedField;
    whyUsTitle?: LocalizedField;
    latestOffersTitle?: LocalizedField;
    contactTitle?: LocalizedField;
  };
  services?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    ctaTitle?: LocalizedField;
    ctaSubtitle?: LocalizedField;
    tours?: {
      title?: LocalizedField;
      description?: LocalizedField;
      features?: LocalizedField[];
      imageUrl?: string;
    };
    tickets?: {
      title?: LocalizedField;
      description?: LocalizedField;
      features?: LocalizedField[];
      imageUrl?: string;
    };
    cruises?: {
      title?: LocalizedField;
      description?: LocalizedField;
      features?: LocalizedField[];
      imageUrl?: string;
    };
  };
  about?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    description?: LocalizedField;
    mission?: LocalizedField;
    missionText?: LocalizedField;
    valuesTitle?: LocalizedField;
    imageUrl?: string;
    values?: Array<{
      icon?: string;
      title?: LocalizedField;
      description?: LocalizedField;
    }>;
    stats?: Array<{
      value?: string;
      label?: LocalizedField;
    }>;
  };
  contacts?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    phoneLabel?: LocalizedField;
    whatsappLabel?: LocalizedField;
    emailLabel?: LocalizedField;
    addressLabel?: LocalizedField;
    workingHoursLabel?: LocalizedField;
    followUsLabel?: LocalizedField;
  };
  footer?: {
    tagline?: LocalizedField;
    quickLinksTitle?: LocalizedField;
    contactTitle?: LocalizedField;
    followUsTitle?: LocalizedField;
    rightsText?: LocalizedField;
  };
}

export interface SiteSettings {
  id: string;
  company_name_ka: string;
  company_name_ru: string;
  company_name_en: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  phones: string[];
  emails: string[];
  address_ka: string | null;
  address_ru: string | null;
  address_en: string | null;
  working_hours_ka: string | null;
  working_hours_ru: string | null;
  working_hours_en: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  map_embed_url: string | null;
  logo_url: string | null;
  site_content: SiteContent;
  updated_at: string;
}

// Get localized field with English fallback
export const getLocalizedSettingsField = (
  settings: SiteSettings | null | undefined,
  field: "company_name" | "address" | "working_hours",
  language: string
): string => {
  if (!settings) return "";
  const langField = `${field}_${language}` as keyof SiteSettings;
  const enField = `${field}_en` as keyof SiteSettings;
  return (settings[langField] as string) || (settings[enField] as string) || "";
};

// Get content from site_content JSON with path support and language fallback
export const getContentField = (
  content: SiteContent | null | undefined,
  path: string,
  language: string
): string => {
  if (!content) return "";
  
  const keys = path.split(".");
  let value: any = content;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }
  
  // If the value is a LocalizedField object, extract the language-specific value
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const localizedValue = value as LocalizedField;
    return localizedValue[language as keyof LocalizedField] || localizedValue.en || "";
  }
  
  // If it's a direct string (like imageUrl), return it
  if (typeof value === "string") {
    return value;
  }
  
  return "";
};

// Fetch site settings (public)
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          phones: (data.phones as string[]) || [],
          emails: (data.emails as string[]) || [],
          logo_url: (data as any).logo_url || null,
          site_content: ((data as any).site_content as SiteContent) || {},
        } as SiteSettings;
      }

      return null;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Admin: Update site settings mutation
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings> & { id: string }) => {
      const { error } = await supabase
        .from("site_settings")
        .update(settings as any)
        .eq("id", settings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
};
