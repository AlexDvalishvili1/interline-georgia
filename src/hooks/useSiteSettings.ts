import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        .update(settings)
        .eq("id", settings.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
  });
};
