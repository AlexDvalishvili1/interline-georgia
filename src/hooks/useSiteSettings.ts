import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Localized field structure for site content
export interface LocalizedField {
  ka?: string;
  ru?: string;
  en?: string;
}

// Block item interfaces for repeatable content
export interface WhyUsItem {
  id: string;
  icon: string;
  title: LocalizedField;
  description: LocalizedField;
}

// Home page service cards (Tours, Air Tickets, Cruises on home page)
export interface ServiceCardItem {
  id: string;
  icon: string;
  title: LocalizedField;
  description: LocalizedField;
}

// Feature item with ID for proper editing (checkmark list items)
export interface FeatureItem {
  id: string;
  text: LocalizedField;
}

// Services page service blocks (with multiple images and features)
export interface ServiceItem {
  id: string;
  icon: string;
  images: string[]; // Array of image URLs (gallery)
  title: LocalizedField;
  description: LocalizedField;
  features: FeatureItem[]; // Array of feature items with IDs
}

export interface ValueItem {
  id: string;
  icon: string;
  title: LocalizedField;
  description: LocalizedField;
}

export interface StatItem {
  id: string;
  value: string;
  label: LocalizedField;
}

// Site content structure for all pages
export interface SiteContent {
  home?: {
    heroTitle?: LocalizedField;
    heroSubtitle?: LocalizedField;
    heroBgImageUrl?: string;
    servicesTitle?: LocalizedField;
    servicesSubtitle?: LocalizedField;
    serviceCards?: ServiceCardItem[]; // Home page service cards
    whyUsTitle?: LocalizedField;
    whyUsItems?: WhyUsItem[];
    latestOffersTitle?: LocalizedField;
    contactTitle?: LocalizedField;
  };
  services?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    ctaTitle?: LocalizedField;
    ctaSubtitle?: LocalizedField;
    items?: ServiceItem[]; // Service blocks with images and features
  };
  about?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    description?: LocalizedField;
    missionTitle?: LocalizedField;
    missionText?: LocalizedField;
    imageUrl?: string;
    valuesTitle?: LocalizedField;
    values?: ValueItem[];
    stats?: StatItem[];
  };
  contacts?: {
    pageTitle?: LocalizedField;
    pageSubtitle?: LocalizedField;
    phoneLabel?: LocalizedField;
    whatsappLabel?: LocalizedField;
    emailLabel?: LocalizedField;
    addressLabel?: LocalizedField;
    workingHoursLabel?: LocalizedField;
    socialTitle?: LocalizedField;
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

// Get array content from site_content
export const getContentArray = <T>(
  content: SiteContent | null | undefined,
  path: string
): T[] => {
  if (!content) return [];
  
  const keys = path.split(".");
  let value: any = content;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) break;
  }
  
  return Array.isArray(value) ? value : [];
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
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Admin: Update site settings mutation
export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings> & { id: string }) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update(settings as any)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const updatedSettings = {
        ...data,
        phones: (data.phones as string[]) || [],
        emails: (data.emails as string[]) || [],
        logo_url: (data as any).logo_url || null,
        site_content: ((data as any).site_content as SiteContent) || {},
      } as SiteSettings;
      
      queryClient.setQueryData(["site_settings"], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
};
