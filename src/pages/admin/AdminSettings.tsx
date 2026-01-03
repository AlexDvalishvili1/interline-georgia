import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Building, Phone, Globe, Plus, X, Image, Home, Briefcase, Info, Mail, FileText } from "lucide-react";
import { toast } from "sonner";
import { 
  useSiteSettings, 
  useUpdateSiteSettings, 
  type SiteSettings, 
  type SiteContent,
  type LocalizedField,
  type WhyUsItem,
  type ServiceItem,
  type ServiceCardItem,
  type ValueItem,
  type StatItem,
  type FeatureItem,
} from "@/hooks/useSiteSettings";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { BlockEditor } from "@/components/admin/BlockEditor";
import { IconPicker } from "@/components/admin/IconPicker";
import { FeatureEditor } from "@/components/admin/FeatureEditor";

// Language tabs for direct settings fields (company name, address, etc.)
// Internal code "ka" for Georgian, but displayed as "GE" in admin UI
const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "ru" as const, label: "Russian", flag: "🇷🇺" },
  { code: "ka" as const, label: "GE", flag: "🇬🇪" },
];

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();

const AdminSettings = () => {
  const { data: fetchedSettings, isLoading } = useSiteSettings();
  const updateMutation = useUpdateSiteSettings();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (fetchedSettings && !settings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings, settings]);

  const handleSave = useCallback(async () => {
    if (!settings) return;
    try {
      await updateMutation.mutateAsync(settings);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  }, [settings, updateMutation]);

  const updateField = useCallback((field: keyof SiteSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [field]: value } : prev);
  }, []);

  // Optimized content update using shallow copy
  const updateContent = useCallback((path: string[], value: any) => {
    setSettings(prev => {
      if (!prev) return prev;
      
      const content = { ...prev.site_content };
      let current: any = content;
      
      // Build nested path with shallow copies
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        current[key] = current[key] ? { ...current[key] } : {};
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      
      return { ...prev, site_content: content };
    });
  }, []);

  const getContent = useCallback((path: string[]): any => {
    if (!settings?.site_content) return undefined;
    let current: any = settings.site_content;
    for (const key of path) {
      if (current[key] === undefined) return undefined;
      current = current[key];
    }
    return current;
  }, [settings?.site_content]);

  // Array helpers for phones/emails
  const addPhone = useCallback(() => {
    setSettings(prev => prev ? { ...prev, phones: [...(prev.phones || []), ""] } : prev);
  }, []);
  
  const updatePhone = useCallback((index: number, value: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      const phones = [...(prev.phones || [])];
      phones[index] = value;
      return { ...prev, phones };
    });
  }, []);
  
  const removePhone = useCallback((index: number) => {
    setSettings(prev => prev ? { ...prev, phones: prev.phones.filter((_, i) => i !== index) } : prev);
  }, []);

  const addEmail = useCallback(() => {
    setSettings(prev => prev ? { ...prev, emails: [...(prev.emails || []), ""] } : prev);
  }, []);
  
  const updateEmail = useCallback((index: number, value: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      const emails = [...(prev.emails || [])];
      emails[index] = value;
      return { ...prev, emails };
    });
  }, []);
  
  const removeEmail = useCallback((index: number) => {
    setSettings(prev => prev ? { ...prev, emails: prev.emails.filter((_, i) => i !== index) } : prev);
  }, []);

  // Block creators
  const createWhyUsItem = useCallback((): WhyUsItem => ({
    id: generateId(),
    icon: "award",
    title: { en: "", ru: "", ka: "" },
    description: { en: "", ru: "", ka: "" },
  }), []);

  const createServiceCardItem = useCallback((): ServiceCardItem => ({
    id: generateId(),
    icon: "map",
    title: { en: "", ru: "", ka: "" },
    description: { en: "", ru: "", ka: "" },
  }), []);

  const createServiceItem = useCallback((): ServiceItem => ({
    id: generateId(),
    icon: "map",
    images: [],
    title: { en: "", ru: "", ka: "" },
    description: { en: "", ru: "", ka: "" },
    features: [],
  }), []);

  const createValueItem = useCallback((): ValueItem => ({
    id: generateId(),
    icon: "award",
    title: { en: "", ru: "", ka: "" },
    description: { en: "", ru: "", ka: "" },
  }), []);

  const createStatItem = useCallback((): StatItem => ({
    id: generateId(),
    value: "",
    label: { en: "", ru: "", ka: "" },
  }), []);

  // Memoized content values to prevent unnecessary re-renders
  const whyUsItems = useMemo(() => 
    (getContent(["home", "whyUsItems"]) as WhyUsItem[]) || [],
    [getContent]
  );

  const serviceCardItems = useMemo(() =>
    (getContent(["home", "serviceCards"]) as ServiceCardItem[]) || [],
    [getContent]
  );

  const serviceItems = useMemo(() =>
    (getContent(["services", "items"]) as ServiceItem[]) || [],
    [getContent]
  );

  const valueItems = useMemo(() =>
    (getContent(["about", "values"]) as ValueItem[]) || [],
    [getContent]
  );

  const statItems = useMemo(() =>
    (getContent(["about", "stats"]) as StatItem[]) || [],
    [getContent]
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
                    <Input 
                      value={settings[`company_name_${lang.code}` as keyof SiteSettings] as string || ""} 
                      onChange={(e) => updateField(`company_name_${lang.code}` as keyof SiteSettings, e.target.value)} 
                    />
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
              <LocalizedInput 
                label="Hero Title" 
                value={getContent(["home", "heroTitle"]) || {}}
                onChange={(value) => updateContent(["home", "heroTitle"], value)}
              />
              <LocalizedInput 
                label="Hero Subtitle" 
                value={getContent(["home", "heroSubtitle"]) || {}}
                onChange={(value) => updateContent(["home", "heroSubtitle"], value)}
                multiline 
              />
              <div className="space-y-2">
                <Label>Hero Background Image</Label>
                <ImageUploader
                  value={getContent(["home", "heroBgImageUrl"]) || ""}
                  onChange={(url) => updateContent(["home", "heroBgImageUrl"], url)}
                  label="Background Image"
                  bucket="post-images"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Services Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Section Title" 
                value={getContent(["home", "servicesTitle"]) || {}}
                onChange={(value) => updateContent(["home", "servicesTitle"], value)}
              />
              <LocalizedInput 
                label="Section Subtitle" 
                value={getContent(["home", "servicesSubtitle"]) || {}}
                onChange={(value) => updateContent(["home", "servicesSubtitle"], value)}
              />
              
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-4 block">Service Cards (Tours, Air Tickets, Cruises)</Label>
                <BlockEditor
                  items={serviceCardItems}
                  onChange={(items) => updateContent(["home", "serviceCards"], items)}
                  createItem={createServiceCardItem}
                  itemLabel="Card"
                  renderItem={(item, _index, update) => (
                    <div className="space-y-4">
                      <IconPicker
                        value={item.icon}
                        onChange={(icon) => update({ icon })}
                      />
                      <LocalizedInput
                        label="Title"
                        value={item.title}
                        onChange={(title) => update({ title })}
                      />
                      <LocalizedInput
                        label="Description"
                        value={item.description}
                        onChange={(description) => update({ description })}
                        multiline
                      />
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Why Us Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Section Title" 
                value={getContent(["home", "whyUsTitle"]) || {}}
                onChange={(value) => updateContent(["home", "whyUsTitle"], value)}
              />
              
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-4 block">Why Us Items</Label>
                <BlockEditor
                  items={whyUsItems}
                  onChange={(items) => updateContent(["home", "whyUsItems"], items)}
                  createItem={createWhyUsItem}
                  itemLabel="Item"
                  renderItem={(item, _index, update) => (
                    <div className="space-y-4">
                      <IconPicker
                        value={item.icon}
                        onChange={(icon) => update({ icon })}
                      />
                      <LocalizedInput
                        label="Title"
                        value={item.title}
                        onChange={(title) => update({ title })}
                      />
                      <LocalizedInput
                        label="Description"
                        value={item.description}
                        onChange={(description) => update({ description })}
                        multiline
                      />
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Latest Offers Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Section Title" 
                value={getContent(["home", "latestOffersTitle"]) || {}}
                onChange={(value) => updateContent(["home", "latestOffersTitle"], value)}
              />
              <LocalizedInput 
                label="Contact Title" 
                value={getContent(["home", "contactTitle"]) || {}}
                onChange={(value) => updateContent(["home", "contactTitle"], value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SERVICES PAGE TAB */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Page Title" 
                value={getContent(["services", "pageTitle"]) || {}}
                onChange={(value) => updateContent(["services", "pageTitle"], value)}
              />
              <LocalizedInput 
                label="Page Subtitle" 
                value={getContent(["services", "pageSubtitle"]) || {}}
                onChange={(value) => updateContent(["services", "pageSubtitle"], value)}
                multiline 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Service Blocks</CardTitle></CardHeader>
            <CardContent>
              <BlockEditor
                items={serviceItems}
                onChange={(items) => updateContent(["services", "items"], items)}
                createItem={createServiceItem}
                itemLabel="Service"
                renderItem={(item, _index, update) => (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IconPicker
                        value={item.icon}
                        onChange={(icon) => update({ icon })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Service Images</Label>
                      <GalleryUploader
                        value={item.images || []}
                        onChange={(images) => update({ images })}
                        label="Upload images for this service"
                        bucket="post-images"
                      />
                    </div>

                    <LocalizedInput
                      label="Title"
                      value={item.title}
                      onChange={(title) => update({ title })}
                    />
                    <LocalizedInput
                      label="Description"
                      value={item.description}
                      onChange={(description) => update({ description })}
                      multiline
                    />
                    
                    <div className="pt-4 border-t">
                      <Label className="text-sm font-medium mb-3 block">Features (Checkmark List)</Label>
                      <FeatureEditor
                        items={item.features || []}
                        onChange={(features) => update({ features })}
                        label="Feature"
                      />
                    </div>
                  </div>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Call to Action</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="CTA Title" 
                value={getContent(["services", "ctaTitle"]) || {}}
                onChange={(value) => updateContent(["services", "ctaTitle"], value)}
              />
              <LocalizedInput 
                label="CTA Subtitle" 
                value={getContent(["services", "ctaSubtitle"]) || {}}
                onChange={(value) => updateContent(["services", "ctaSubtitle"], value)}
                multiline 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABOUT PAGE TAB */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Page Title" 
                value={getContent(["about", "pageTitle"]) || {}}
                onChange={(value) => updateContent(["about", "pageTitle"], value)}
              />
              <LocalizedInput 
                label="Page Subtitle" 
                value={getContent(["about", "pageSubtitle"]) || {}}
                onChange={(value) => updateContent(["about", "pageSubtitle"], value)}
                multiline 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Main Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Description" 
                value={getContent(["about", "description"]) || {}}
                onChange={(value) => updateContent(["about", "description"], value)}
                multiline 
              />
              <LocalizedInput 
                label="Mission Title" 
                value={getContent(["about", "missionTitle"]) || {}}
                onChange={(value) => updateContent(["about", "missionTitle"], value)}
              />
              <LocalizedInput 
                label="Mission Text" 
                value={getContent(["about", "missionText"]) || {}}
                onChange={(value) => updateContent(["about", "missionText"], value)}
                multiline 
              />
              <div className="space-y-2">
                <Label>About Image</Label>
                <ImageUploader
                  value={getContent(["about", "imageUrl"]) || ""}
                  onChange={(url) => updateContent(["about", "imageUrl"], url)}
                  label="About Image"
                  bucket="post-images"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Values Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Values Title" 
                value={getContent(["about", "valuesTitle"]) || {}}
                onChange={(value) => updateContent(["about", "valuesTitle"], value)}
              />
              
              <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-4 block">Values</Label>
                <BlockEditor
                  items={valueItems}
                  onChange={(items) => updateContent(["about", "values"], items)}
                  createItem={createValueItem}
                  itemLabel="Value"
                  renderItem={(item, _index, update) => (
                    <div className="space-y-4">
                      <IconPicker
                        value={item.icon}
                        onChange={(icon) => update({ icon })}
                      />
                      <LocalizedInput
                        label="Title"
                        value={item.title}
                        onChange={(title) => update({ title })}
                      />
                      <LocalizedInput
                        label="Description"
                        value={item.description}
                        onChange={(description) => update({ description })}
                        multiline
                      />
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
            <CardContent>
              <BlockEditor
                items={statItems}
                onChange={(items) => updateContent(["about", "stats"], items)}
                createItem={createStatItem}
                itemLabel="Stat"
                renderItem={(item, _index, update) => (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Value (e.g., "20+", "5000+")</Label>
                      <Input
                        value={item.value}
                        onChange={(e) => update({ value: e.target.value })}
                        placeholder="20+"
                      />
                    </div>
                    <LocalizedInput
                      label="Label"
                      value={item.label}
                      onChange={(label) => update({ label })}
                    />
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACTS PAGE TAB */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Page Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Page Title" 
                value={getContent(["contacts", "pageTitle"]) || {}}
                onChange={(value) => updateContent(["contacts", "pageTitle"], value)}
              />
              <LocalizedInput 
                label="Page Subtitle" 
                value={getContent(["contacts", "pageSubtitle"]) || {}}
                onChange={(value) => updateContent(["contacts", "pageSubtitle"], value)}
                multiline 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact Labels</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Phone Label" 
                value={getContent(["contacts", "phoneLabel"]) || {}}
                onChange={(value) => updateContent(["contacts", "phoneLabel"], value)}
              />
              <LocalizedInput 
                label="WhatsApp Label" 
                value={getContent(["contacts", "whatsappLabel"]) || {}}
                onChange={(value) => updateContent(["contacts", "whatsappLabel"], value)}
              />
              <LocalizedInput 
                label="Email Label" 
                value={getContent(["contacts", "emailLabel"]) || {}}
                onChange={(value) => updateContent(["contacts", "emailLabel"], value)}
              />
              <LocalizedInput 
                label="Address Label" 
                value={getContent(["contacts", "addressLabel"]) || {}}
                onChange={(value) => updateContent(["contacts", "addressLabel"], value)}
              />
              <LocalizedInput 
                label="Working Hours Label" 
                value={getContent(["contacts", "workingHoursLabel"]) || {}}
                onChange={(value) => updateContent(["contacts", "workingHoursLabel"], value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Social Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Social Title" 
                value={getContent(["contacts", "socialTitle"]) || {}}
                onChange={(value) => updateContent(["contacts", "socialTitle"], value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FOOTER TAB */}
        <TabsContent value="footer" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Footer Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput 
                label="Tagline" 
                value={getContent(["footer", "tagline"]) || {}}
                onChange={(value) => updateContent(["footer", "tagline"], value)}
                multiline 
              />
              <LocalizedInput 
                label="Quick Links Title" 
                value={getContent(["footer", "quickLinksTitle"]) || {}}
                onChange={(value) => updateContent(["footer", "quickLinksTitle"], value)}
              />
              <LocalizedInput 
                label="Contact Title" 
                value={getContent(["footer", "contactTitle"]) || {}}
                onChange={(value) => updateContent(["footer", "contactTitle"], value)}
              />
              <LocalizedInput 
                label="Follow Us Title" 
                value={getContent(["footer", "followUsTitle"]) || {}}
                onChange={(value) => updateContent(["footer", "followUsTitle"], value)}
              />
              <LocalizedInput 
                label="Rights Text" 
                value={getContent(["footer", "rightsText"]) || {}}
                onChange={(value) => updateContent(["footer", "rightsText"], value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
