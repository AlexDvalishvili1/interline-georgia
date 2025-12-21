import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Building, Phone, Globe, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings, useUpdateSiteSettings, type SiteSettings } from "@/hooks/useSiteSettings";

const AdminSettings = () => {
  const { data: fetchedSettings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Sync fetched settings to local state
  if (fetchedSettings && !settings) {
    setSettings(fetchedSettings);
  }

  const handleSave = async () => {
    if (!settings) return;
    try {
      await updateMutation.mutateAsync(settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    if (settings) setSettings({ ...settings, [field]: value });
  };

  const addPhone = () => {
    if (settings) updateField("phones", [...(settings.phones || []), ""]);
  };

  const updatePhone = (index: number, value: string) => {
    if (settings) {
      const phones = [...(settings.phones || [])];
      phones[index] = value;
      updateField("phones", phones);
    }
  };

  const removePhone = (index: number) => {
    if (settings) updateField("phones", settings.phones.filter((_, i) => i !== index));
  };

  const addEmail = () => {
    if (settings) updateField("emails", [...(settings.emails || []), ""]);
  };

  const updateEmail = (index: number, value: string) => {
    if (settings) {
      const emails = [...(settings.emails || [])];
      emails[index] = value;
      updateField("emails", emails);
    }
  };

  const removeEmail = (index: number) => {
    if (settings) updateField("emails", settings.emails.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  if (!settings) {
    return <div className="text-center py-12"><p className="text-muted-foreground">No settings found.</p></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Manage company information and contacts</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Company Name */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" />Company Name</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <Input value={settings[`company_name_${lang}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`company_name_${lang}` as keyof SiteSettings, e.target.value)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" />Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {/* Multiple Phones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Phone Numbers</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPhone}><Plus className="w-4 h-4 mr-1" />Add Phone</Button>
            </div>
            {settings.phones.map((phone, idx) => (
              <div key={idx} className="flex gap-2">
                <Input value={phone} onChange={(e) => updatePhone(idx, e.target.value)} placeholder="+995 32 200 00 00" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(idx)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={settings.whatsapp || ""} onChange={(e) => updateField("whatsapp", e.target.value)} placeholder="+995 32 200 00 00" />
          </div>

          {/* Multiple Emails */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Email Addresses</Label>
              <Button type="button" variant="outline" size="sm" onClick={addEmail}><Plus className="w-4 h-4 mr-1" />Add Email</Button>
            </div>
            {settings.emails.map((email, idx) => (
              <div key={idx} className="flex gap-2">
                <Input type="email" value={email} onChange={(e) => updateEmail(idx, e.target.value)} placeholder="info@company.com" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(idx)}><X className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader><CardTitle>Address</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <Input value={settings[`address_${lang}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`address_${lang}` as keyof SiteSettings, e.target.value)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader><CardTitle>Working Hours</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="mb-4">
              <TabsTrigger value="en">🇬🇧 English</TabsTrigger>
              <TabsTrigger value="ka">🇬🇪 ქართული</TabsTrigger>
              <TabsTrigger value="ru">🇷🇺 Русский</TabsTrigger>
            </TabsList>
            {["en", "ka", "ru"].map((lang) => (
              <TabsContent key={lang} value={lang}>
                <Input value={settings[`working_hours_${lang}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`working_hours_${lang}` as keyof SiteSettings, e.target.value)} placeholder="Mon - Fri: 10:00 - 19:00" />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Social & Map */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Social Media & Map</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" value={settings.facebook_url || ""} onChange={(e) => updateField("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" value={settings.instagram_url || ""} onChange={(e) => updateField("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input id="tiktok" value={settings.tiktok_url || ""} onChange={(e) => updateField("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input id="youtube" value={settings.youtube_url || ""} onChange={(e) => updateField("youtube_url", e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="map">Google Maps Embed URL</Label>
            <Input id="map" value={settings.map_embed_url || ""} onChange={(e) => updateField("map_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
