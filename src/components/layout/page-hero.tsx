import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Overline } from "@/components/typography/overline";
import { Display } from "@/components/typography/display";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  overline?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  centered?: boolean;
  image?: string;
  imageAlt?: string;
}

export function PageHero({
  overline,
  title,
  description,
  children,
  centered = false,
  image,
  imageAlt = "",
}: PageHeroProps) {
  if (image) {
    return (
      <section className="relative border-b border-stone-200 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-900/75" />
        </div>
        <Container className="relative z-10 section-padding-sm">
          <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
            {overline && (
              <Overline className="text-orange-300 mb-4 block">{overline}</Overline>
            )}
            <Display size="md" className="text-white mb-4">
              {title}
            </Display>
            {description && (
              <p className="text-lg text-stone-300 leading-relaxed">{description}</p>
            )}
            {children}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="section-padding-sm bg-stone-50 border-b border-stone-200">
      <Container>
        <div className={cn(centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl")}>
          {overline && (
            <Overline accent className="mb-4 block">
              {overline}
            </Overline>
          )}
          <Display size="md" className="mb-4">
            {title}
          </Display>
          {description && (
            <p className="text-lg text-stone-600 leading-relaxed">{description}</p>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
