import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface PostFormData {
  slug: string;
  category: string;
  is_published: boolean;
  cover_image_url: string;
  gallery: string[];
  title_ka: string;
  title_ru: string;
  title_en: string;
  excerpt_ka: string;
  excerpt_ru: string;
  excerpt_en: string;
  content_ka: string;
  content_ru: string;
  content_en: string;
}

const defaultFormData: PostFormData = {
  slug: "",
  category: "offer",
  is_published: false,
  cover_image_url: "",
  gallery: [],
  title_ka: "",
  title_ru: "",
  title_en: "",
  excerpt_ka: "",
  excerpt_ru: "",
  excerpt_en: "",
  content_ka: "",
  content_ru: "",
  content_en: "",
};

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = id === "new";

  const [formData, setFormData] = useState<PostFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [galleryInput, setGalleryInput] = useState("");

  useEffect(() => {
    if (!isNew && id) {
      fetchPost(id);
    }
  }, [id, isNew]);

  const fetchPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          slug: data.slug,
          category: data.category,
          is_published: data.is_published,
          cover_image_url: data.cover_image_url || "",
          gallery: (data.gallery as string[]) || [],
          title_ka: data.title_ka,
          title_ru: data.title_ru,
          title_en: data.title_en,
          excerpt_ka: data.excerpt_ka,
          excerpt_ru: data.excerpt_ru,
          excerpt_en: data.excerpt_en,
          content_ka: data.content_ka,
          content_ru: data.content_ru,
          content_en: data.content_en,
        });
        setGalleryInput((data.gallery as string[])?.join("\n") || "");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast.error("Failed to load post");
      navigate("/admin/posts");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (lang: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`title_${lang}`]: value,
    }));
    
    // Auto-generate slug from English title if it's a new post
    if (lang === "en" && isNew && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        title_en: value,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!formData.title_en.trim()) {
      toast.error("English title is required");
      return;
    }

    setIsSaving(true);
    try {
      // Parse gallery from input
      const gallery = galleryInput
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      const postData = {
        ...formData,
        gallery,
        created_by: user?.id,
      };

      if (isNew) {
        const { error } = await supabase.from("posts").insert(postData);
        if (error) throw error;
        toast.success("Post created successfully");
      } else {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id);
        if (error) throw error;
        toast.success("Post updated successfully");
      }

      navigate("/admin/posts");
    } catch (error: any) {
      console.error("Error saving post:", error);
      if (error.code === "23505") {
        toast.error("A post with this slug already exists");
      } else {
        toast.error("Failed to save post");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/posts")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-heading font-bold">
            {isNew ? "New Post" : "Edit Post"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save
        </Button>
      </div>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="my-post-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL</Label>
            <Input
              id="cover"
              value={formData.cover_image_url}
              onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
              placeholder="https://..."
            />
            {formData.cover_image_url && (
              <div className="mt-2 aspect-video max-w-sm rounded-lg overflow-hidden bg-muted">
                <img
                  src={formData.cover_image_url}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery">Gallery Images (one URL per line)</Label>
            <Textarea
              id="gallery"
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              placeholder="https://image1.jpg&#10;https://image2.jpg"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multilingual Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content (Multilingual)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>

            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title ({lang.toUpperCase()})</Label>
                  <Input
                    value={formData[`title_${lang}` as keyof PostFormData] as string}
                    onChange={(e) => handleTitleChange(lang, e.target.value)}
                    placeholder={`Enter title in ${lang === "ka" ? "Georgian" : lang === "ru" ? "Russian" : "English"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Excerpt ({lang.toUpperCase()})</Label>
                  <Textarea
                    value={formData[`excerpt_${lang}` as keyof PostFormData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [`excerpt_${lang}`]: e.target.value })
                    }
                    placeholder="Short description for listings..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content ({lang.toUpperCase()})</Label>
                  <Textarea
                    value={formData[`content_${lang}` as keyof PostFormData] as string}
                    onChange={(e) =>
                      setFormData({ ...formData, [`content_${lang}`]: e.target.value })
                    }
                    placeholder="Full post content..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostEditor;
