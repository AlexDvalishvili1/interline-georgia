import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Building, Phone, Globe, Plus, X, Image, Home, Briefcase, Info, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings, useUpdateSiteSettings, type SiteSettings, type SiteContent, type LocalizedField } from "@/hooks/useSiteSettings";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Language = "en" | "ka" | "ru";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const AdminSettings = () => {
  const { data: fetchedSettings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (fetchedSettings && !settings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

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

  // Deep update for site_content
  const updateContent = (path: string[], value: any) => {
    if (!settings) return;
    const content = JSON.parse(JSON.stringify(settings.site_content || {}));
    let current: any = content;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setSettings({ ...settings, site_content: content });
  };

  const getContent = (path: string[]): any => {
    if (!settings?.site_content) return "";
    let current: any = settings.site_content;
    for (const key of path) {
      if (!current[key]) return "";
      current = current[key];
    }
    return current || "";
  };

  // Array helpers for phones/emails
  const addPhone = () => updateField("phones", [...(settings?.phones || []), ""]);
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

  const addEmail = () => updateField("emails", [...(settings?.emails || []), ""]);
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

  // Localized field component
  const LocalizedInput = ({ label, path, multiline = false }: { label: string; path: string[]; multiline?: boolean }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="mb-2">
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.code.toUpperCase()}</TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code}>
            {multiline ? (
              <Textarea
                value={getContent([...path, lang.code]) || ""}
                onChange={(e) => updateContent([...path, lang.code], e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                value={getContent([...path, lang.code]) || ""}
                onChange={(e) => updateContent([...path, lang.code], e.target.value)}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  if (!settings) {
    return <div className="text-center py-12"><p className="text-muted-foreground">No settings found.</p></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Site Settings</h1>
          <p className="text-muted-foreground">Manage company info and page content</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-1"><Building className="w-4 h-4" />General</TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-1"><Image className="w-4 h-4" />Logo</TabsTrigger>
          <TabsTrigger value="home" className="flex items-center gap-1"><Home className="w-4 h-4" />Home</TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-1"><Briefcase className="w-4 h-4" />Services</TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-1"><Info className="w-4 h-4" />About</TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1"><Mail className="w-4 h-4" />Contacts</TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-1"><FileText className="w-4 h-4" />Footer</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building className="w-5 h-5" />Company Name</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="en">
                <TabsList className="mb-4">
                  {LANGUAGES.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.label}</TabsTrigger>
                  ))}
                </TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code}>
                    <Input value={settings[`company_name_${lang.code}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`company_name_${lang.code}` as keyof SiteSettings, e.target.value)} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" />Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Phone Numbers</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addPhone}><Plus className="w-4 h-4 mr-1" />Add</Button>
                </div>
                {settings.phones.map((phone, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input value={phone} onChange={(e) => updatePhone(idx, e.target.value)} placeholder="+995 32 200 00 00" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(idx)}><X className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={settings.whatsapp || ""} onChange={(e) => updateField("whatsapp", e.target.value)} placeholder="+995 32 200 00 00" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Email Addresses</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addEmail}><Plus className="w-4 h-4 mr-1" />Add</Button>
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

          <Card>
            <CardHeader><CardTitle>Address</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="en">
                <TabsList className="mb-4">
                  {LANGUAGES.map((lang) => (<TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.label}</TabsTrigger>))}
                </TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code}>
                    <Input value={settings[`address_${lang.code}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`address_${lang.code}` as keyof SiteSettings, e.target.value)} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Working Hours</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="en">
                <TabsList className="mb-4">
                  {LANGUAGES.map((lang) => (<TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.label}</TabsTrigger>))}
                </TabsList>
                {LANGUAGES.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code}>
                    <Input value={settings[`working_hours_${lang.code}` as keyof SiteSettings] as string || ""} onChange={(e) => updateField(`working_hours_${lang.code}` as keyof SiteSettings, e.target.value)} placeholder="Mon - Fri: 10:00 - 19:00" />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Social Media & Map</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facebook URL</Label>
                  <Input value={settings.facebook_url || ""} onChange={(e) => updateField("facebook_url", e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>Instagram URL</Label>
                  <Input value={settings.instagram_url || ""} onChange={(e) => updateField("instagram_url", e.target.value)} placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-2">
                  <Label>TikTok URL</Label>
                  <Input value={settings.tiktok_url || ""} onChange={(e) => updateField("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@..." />
                </div>
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input value={settings.youtube_url || ""} onChange={(e) => updateField("youtube_url", e.target.value)} placeholder="https://youtube.com/..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Google Maps Embed URL</Label>
                <Input value={settings.map_embed_url || ""} onChange={(e) => updateField("map_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LOGO TAB */}
        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Logo</CardTitle></CardHeader>
            <CardContent>
              <ImageUploader
                value={settings.logo_url || ""}
                onChange={(url) => updateField("logo_url", url)}
                label="Company Logo"
                bucket="post-images"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* HOME PAGE TAB */}
        <TabsContent value="home" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Hero Title" path={["home", "hero", "title"]} />
              <LocalizedInput label="Hero Subtitle" path={["home", "hero", "subtitle"]} multiline />
              <div className="space-y-2">
                <Label>Hero Background Image</Label>
                <ImageUploader
                  value={getContent(["home", "hero", "backgroundImage"]) || ""}
                  onChange={(url) => updateContent(["home", "hero", "backgroundImage"], url)}
                  label="Background Image"
                  bucket="post-images"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Services Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Section Title" path={["home", "services", "title"]} />
              <LocalizedInput label="Section Subtitle" path={["home", "services", "subtitle"]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Why Us Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Section Title" path={["home", "whyUs", "title"]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Latest Offers Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Section Title" path={["home", "latestOffers", "title"]} />
              <LocalizedInput label="View All Button" path={["home", "latestOffers", "viewAll"]} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVICES PAGE TAB */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Page Title" path={["services", "title"]} />
              <LocalizedInput label="Page Subtitle" path={["services", "subtitle"]} multiline />
            </CardContent>
          </Card>

          {["tours", "tickets", "cruises"].map((service) => (
            <Card key={service}>
              <CardHeader><CardTitle className="capitalize">{service}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <LocalizedInput label="Title" path={["services", service, "title"]} />
                <LocalizedInput label="Description" path={["services", service, "description"]} multiline />
                <div className="space-y-2">
                  <Label>Image</Label>
                  <ImageUploader
                    value={getContent(["services", service, "image"]) || ""}
                    onChange={(url) => updateContent(["services", service, "image"], url)}
                    label={`${service} Image`}
                    bucket="post-images"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ABOUT PAGE TAB */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Page Title" path={["about", "title"]} />
              <LocalizedInput label="Page Subtitle" path={["about", "subtitle"]} multiline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Main Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Description" path={["about", "description"]} multiline />
              <LocalizedInput label="Mission Title" path={["about", "missionTitle"]} />
              <LocalizedInput label="Mission Text" path={["about", "missionText"]} multiline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Values Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Values Title" path={["about", "valuesTitle"]} />
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-2">
                  <Label className="font-semibold">Value {idx + 1}</Label>
                  <LocalizedInput label="Title" path={["about", "values", String(idx), "title"]} />
                  <LocalizedInput label="Description" path={["about", "values", String(idx), "description"]} multiline />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACTS PAGE TAB */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Page Title" path={["contacts", "title"]} />
              <LocalizedInput label="Page Subtitle" path={["contacts", "subtitle"]} multiline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact Labels</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Phone Label" path={["contacts", "phoneLabel"]} />
              <LocalizedInput label="WhatsApp Label" path={["contacts", "whatsappLabel"]} />
              <LocalizedInput label="Email Label" path={["contacts", "emailLabel"]} />
              <LocalizedInput label="Address Label" path={["contacts", "addressLabel"]} />
              <LocalizedInput label="Working Hours Label" path={["contacts", "workingHoursLabel"]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Social Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Social Title" path={["contacts", "socialTitle"]} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER TAB */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Footer Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput label="Tagline" path={["footer", "tagline"]} multiline />
              <LocalizedInput label="Quick Links Title" path={["footer", "quickLinksTitle"]} />
              <LocalizedInput label="Contact Title" path={["footer", "contactTitle"]} />
              <LocalizedInput label="Rights Text" path={["footer", "rights"]} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
