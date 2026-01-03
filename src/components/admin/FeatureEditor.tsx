import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { LocalizedInput } from "./LocalizedInput";
import type { LocalizedField } from "@/hooks/useSiteSettings";

export interface FeatureItem {
  id: string;
  text: LocalizedField;
}

interface FeatureEditorProps {
  items: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
  label?: string;
}

const generateId = () => crypto.randomUUID();

const FeatureEditorInner = ({ items, onChange, label = "Feature" }: FeatureEditorProps) => {
  const addItem = useCallback(() => {
    const newItem: FeatureItem = {
      id: generateId(),
      text: { en: "", ru: "", ka: "" },
    };
    onChange([...items, newItem]);
  }, [items, onChange]);

  const removeItem = useCallback((index: number) => {
    onChange(items.filter((_, i) => i !== index));
  }, [items, onChange]);

  const moveItem = useCallback((index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  }, [items, onChange]);

  const updateItem = useCallback((index: number, text: LocalizedField) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], text };
    onChange(newItems);
  }, [items, onChange]);

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Card key={item.id} className="border-dashed">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <LocalizedInput
                  label={`${label} ${index + 1}`}
                  value={item.text}
                  onChange={(text) => updateItem(index, text)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {label}
      </Button>
    </div>
  );
};

export const FeatureEditor = memo(FeatureEditorInner);
