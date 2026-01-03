import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LocalizedField } from "@/hooks/useSiteSettings";

// Language order: English, Russian, Georgian (internal code "ka", shown as "GE")
const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "ru" as const, label: "Russian", flag: "🇷🇺" },
  { code: "ka" as const, label: "GE", flag: "🇬🇪" },
];

interface LocalizedInputProps {
  label: string;
  value: LocalizedField;
  onChange: (value: LocalizedField) => void;
  multiline?: boolean;
  placeholder?: string;
}

export const LocalizedInput = memo(function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: LocalizedInputProps) {
  const handleChange = useCallback(
    (langCode: "en" | "ru" | "ka", newValue: string) => {
      onChange({ ...value, [langCode]: newValue });
    },
    [value, onChange]
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="mb-2">
          {LANGUAGES.map((lang) => (
            <TabsTrigger key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGUAGES.map((lang) => (
          <TabsContent key={lang.code} value={lang.code}>
            {multiline ? (
              <Textarea
                value={value?.[lang.code] || ""}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                rows={3}
                placeholder={placeholder}
              />
            ) : (
              <Input
                value={value?.[lang.code] || ""}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                placeholder={placeholder}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});
