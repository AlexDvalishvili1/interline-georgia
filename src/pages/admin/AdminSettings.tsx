import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Building, Phone, Globe } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  id: string;
  company_name_ka: string;
  company_name_ru: string;
  company_name_en: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_ka: string;
  address_ru: string;
  address_en: string;
  working_hours_ka: string;
  working_hours_ru: string;
  working_hours_en: string;
  facebook_url: string;
  instagram_url: string;
  map_embed_url: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update(settings)
        .eq("id", settings.id);

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No settings found. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Manage company information and contacts</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Company Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-2">
                  <Label>Company Name ({lang.toUpperCase()})</Label>
                  <Input
                    value={settings[`company_name_${lang}` as keyof SiteSettings] as string}
                    onChange={(e) => updateField(`company_name_${lang}` as keyof SiteSettings, e.target.value)}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+995 32 200 00 00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={(e) => updateField("whatsapp", e.target.value)}
                placeholder="+995 32 200 00 00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="info@interline.ge"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-2">
                  <Label>Address ({lang.toUpperCase()})</Label>
                  <Input
                    value={settings[`address_${lang}` as keyof SiteSettings] as string}
                    onChange={(e) => updateField(`address_${lang}` as keyof SiteSettings, e.target.value)}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <div className="space-y-2">
                  <Label>Working Hours ({lang.toUpperCase()})</Label>
                  <Input
                    value={settings[`working_hours_${lang}` as keyof SiteSettings] as string}
                    onChange={(e) => updateField(`working_hours_${lang}` as keyof SiteSettings, e.target.value)}
                    placeholder="Mon - Fri: 10:00 - 19:00"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Social & Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Social Media & Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={settings.facebook_url}
                onChange={(e) => updateField("facebook_url", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={settings.instagram_url}
                onChange={(e) => updateField("instagram_url", e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="map">Google Maps Embed URL</Label>
            <Input
              id="map"
              value={settings.map_embed_url}
              onChange={(e) => updateField("map_embed_url", e.target.value)}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
