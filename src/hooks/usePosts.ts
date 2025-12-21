import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Post {
  id: string;
  slug: string;
  category: string;
  is_published: boolean;
  cover_image_url: string | null;
  gallery: string[] | null;
  title_ka: string;
  title_ru: string;
  title_en: string;
  excerpt_ka: string;
  excerpt_ru: string;
  excerpt_en: string;
  content_ka: string;
  content_ru: string;
  content_en: string;
  created_at: string;
  updated_at: string;
  display_locations: string[];
  sort_order: number | null;
  pinned: boolean;
  featured: boolean;
}

// Get localized field with English fallback
export const getLocalizedField = (
  post: Post,
  field: "title" | "excerpt" | "content",
  language: string
): string => {
  const langField = `${field}_${language}` as keyof Post;
  const enField = `${field}_en` as keyof Post;
  return (post[langField] as string) || (post[enField] as string) || "";
};

// Fetch posts for public pages with display location filter
export const usePosts = (options?: {
  displayLocation?: string;
  category?: string;
  search?: string;
  language?: string;
}) => {
  return useQuery({
    queryKey: ["posts", "public", options],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("is_published", true);

      // Filter by display location
      if (options?.displayLocation) {
        query = query.contains("display_locations", [options.displayLocation]);
      }

      // Filter by category
      if (options?.category) {
        query = query.eq("category", options.category);
      }

      // Order: pinned first, then by sort_order, then by created_at
      query = query
        .order("pinned", { ascending: false })
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Cast gallery to string[] and filter by search if provided
      let posts = (data || []).map((post) => ({
        ...post,
        gallery: (post.gallery as string[]) || [],
        display_locations: (post.display_locations as string[]) || ["offers_page"],
      })) as Post[];

      // Client-side search filtering for title
      if (options?.search && options?.language) {
        const searchLower = options.search.toLowerCase();
        posts = posts.filter((post) => {
          const title = getLocalizedField(post, "title", options.language!);
          return title.toLowerCase().includes(searchLower);
        });
      }

      return posts;
    },
  });
};

// Fetch a single post by slug
export const usePost = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["posts", "single", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return {
        ...data,
        gallery: (data.gallery as string[]) || [],
        display_locations: (data.display_locations as string[]) || ["offers_page"],
      } as Post;
    },
    enabled: !!slug,
  });
};

// Fetch latest offers for home page
export const useLatestOffers = (limit: number = 3) => {
  return useQuery({
    queryKey: ["posts", "home_latest", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .contains("display_locations", ["home_latest"])
        .order("pinned", { ascending: false })
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((post) => ({
        ...post,
        gallery: (post.gallery as string[]) || [],
        display_locations: (post.display_locations as string[]) || ["offers_page"],
      })) as Post[];
    },
  });
};

// Admin: Fetch all posts (including drafts)
export const useAdminPosts = () => {
  return useQuery({
    queryKey: ["posts", "admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((post) => ({
        ...post,
        gallery: (post.gallery as string[]) || [],
        display_locations: (post.display_locations as string[]) || ["offers_page"],
      })) as Post[];
    },
  });
};

// Admin: Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
