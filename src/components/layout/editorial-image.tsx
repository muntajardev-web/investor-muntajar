import Image from "next/image";
import { cn } from "@/lib/utils";

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  aspect?: "video" | "square" | "portrait" | "wide" | "auto";
  priority?: boolean;
  sizes?: string;
}

const aspectMap = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[21/9]",
  auto: "",
};

export function EditorialImage({
  src,
  alt,
  className,
  aspect = "video",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: EditorialImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-stone-200",
        aspectMap[aspect],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
