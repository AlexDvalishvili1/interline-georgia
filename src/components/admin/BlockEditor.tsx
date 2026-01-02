import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Trash2, Plus, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockEditorProps<T extends { id: string }> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    updateItem: (updates: Partial<T>) => void
  ) => React.ReactNode;
  createItem: () => T;
  itemLabel?: string;
  maxItems?: number;
  className?: string;
}

function BlockEditorInner<T extends { id: string }>({
  items,
  onChange,
  renderItem,
  createItem,
  itemLabel = "Item",
  maxItems,
  className,
}: BlockEditorProps<T>) {
  const addItem = useCallback(() => {
    if (maxItems && items.length >= maxItems) return;
    onChange([...items, createItem()]);
  }, [items, onChange, createItem, maxItems]);

  const removeItem = useCallback(
    (index: number) => {
      onChange(items.filter((_, i) => i !== index));
    },
    [items, onChange]
  );

  const moveItem = useCallback(
    (from: number, to: number) => {
      if (to < 0 || to >= items.length) return;
      const newItems = [...items];
      const [removed] = newItems.splice(from, 1);
      newItems.splice(to, 0, removed);
      onChange(newItems);
    },
    [items, onChange]
  );

  const updateItem = useCallback(
    (index: number, updates: Partial<T>) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], ...updates };
      onChange(newItems);
    },
    [items, onChange]
  );

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4 space-y-0">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {itemLabel} {index + 1}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => moveItem(index, index - 1)}
                disabled={index === 0}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => moveItem(index, index + 1)}
                disabled={index === items.length - 1}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4">
            {renderItem(item, index, (updates) => updateItem(index, updates))}
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addItem}
        disabled={maxItems ? items.length >= maxItems : false}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {itemLabel}
      </Button>
    </div>
  );
}

export const BlockEditor = memo(BlockEditorInner) as typeof BlockEditorInner;
