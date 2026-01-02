import React, { memo, useState } from "react";
import {
  Award,
  Star,
  Heart,
  Globe,
  Shield,
  Headphones,
  Map,
  Plane,
  Ship,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Zap,
  Target,
  ThumbsUp,
  Compass,
  Anchor,
  Briefcase,
  Camera,
  Coffee,
  Gift,
  Home,
  Key,
  Lightbulb,
  MessageCircle,
  Phone,
  Settings,
  Smile,
  Sun,
  Umbrella,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Available icons for selection
export const AVAILABLE_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "award", icon: Award },
  { name: "star", icon: Star },
  { name: "heart", icon: Heart },
  { name: "globe", icon: Globe },
  { name: "shield", icon: Shield },
  { name: "headphones", icon: Headphones },
  { name: "map", icon: Map },
  { name: "plane", icon: Plane },
  { name: "ship", icon: Ship },
  { name: "clock", icon: Clock },
  { name: "users", icon: Users },
  { name: "check-circle", icon: CheckCircle },
  { name: "trending-up", icon: TrendingUp },
  { name: "zap", icon: Zap },
  { name: "target", icon: Target },
  { name: "thumbs-up", icon: ThumbsUp },
  { name: "compass", icon: Compass },
  { name: "anchor", icon: Anchor },
  { name: "briefcase", icon: Briefcase },
  { name: "camera", icon: Camera },
  { name: "coffee", icon: Coffee },
  { name: "gift", icon: Gift },
  { name: "home", icon: Home },
  { name: "key", icon: Key },
  { name: "lightbulb", icon: Lightbulb },
  { name: "message-circle", icon: MessageCircle },
  { name: "phone", icon: Phone },
  { name: "settings", icon: Settings },
  { name: "smile", icon: Smile },
  { name: "sun", icon: Sun },
  { name: "umbrella", icon: Umbrella },
  { name: "wifi", icon: Wifi },
];

// Get icon component by name
export const getIconByName = (name: string): LucideIcon => {
  const found = AVAILABLE_ICONS.find((i) => i.name === name);
  return found?.icon || Award;
};

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const IconPicker = memo(function IconPicker({
  value,
  onChange,
  label = "Icon",
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIconByName(value);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-10"
          >
            <SelectedIcon className="w-4 h-4" />
            <span className="capitalize">{value || "Select icon"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <div className="grid grid-cols-6 gap-1">
            {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
              <Button
                key={name}
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10",
                  value === name && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                }}
                title={name}
              >
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
