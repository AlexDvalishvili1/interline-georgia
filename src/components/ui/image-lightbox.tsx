import {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, X} from "lucide-react";

interface ImageLightboxProps {
    images: string[];
    initialIndex?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ImageLightbox = ({
                                  images,
                                  initialIndex = 0,
                                  open,
                                  onOpenChange,
                              }: ImageLightboxProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (open) setCurrentIndex(initialIndex);
    }, [open, initialIndex]);

    const goNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, goNext, goPrev, onOpenChange]);

    if (images.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-sm border-none">
                <div className="relative flex items-center justify-center min-h-[60vh]">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-10 bg-background/50 hover:bg-background/80"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="w-5 h-5"/>
                    </Button>

                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 z-10 bg-background/50 hover:bg-background/80"
                                onClick={goPrev}
                            >
                                <ChevronLeft className="w-6 h-6"/>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 z-10 bg-background/50 hover:bg-background/80"
                                onClick={goNext}
                            >
                                <ChevronRight className="w-6 h-6"/>
                            </Button>
                        </>
                    )}

                    {/* Main image */}
                    <div className="relative w-[95vw] max-w-[1200px] h-[85vh]">
                        <Image
                            src={images[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            fill
                            sizes="95vw"
                            className="object-contain"
                            priority={open}
                        />
                    </div>

                    {images.length > 1 && (
                        <div
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 rounded-full text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto justify-center">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                className={`rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                    idx === currentIndex
                                        ? "border-accent"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Go to image ${idx + 1}`}
                            >
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};