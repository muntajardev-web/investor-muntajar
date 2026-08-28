import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StoryItem {
  id: string;
  photo: string;
  name: string;
  role: string;
  pathway: string;
  quote: string;
}

interface StoryTestimonialProps {
  story: StoryItem;
  index: number;
  showLink?: boolean;
}

export function StoryTestimonial({ story, index, showLink = false }: StoryTestimonialProps) {
  const reversed = index % 2 === 1;

  return (
    <article
      id={story.id}
      className={cn(
        "scroll-mt-24 py-12 md:py-16",
        index > 0 && "border-t border-stone-200",
      )}
    >
      <div
        className={cn(
          "grid lg:grid-cols-12 gap-8 lg:gap-14 items-center",
          reversed && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        )}
      >
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[260px] aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100 border border-stone-200">
            <Image
              src={story.photo}
              alt={story.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 260px, 300px"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="inline-block mb-5 text-[11px] font-semibold uppercase tracking-widest text-orange-600">
            {story.pathway}
          </span>

          <blockquote className="font-display text-xl md:text-2xl lg:text-[1.65rem] text-stone-900 leading-snug mb-8">
            &ldquo;{story.quote}&rdquo;
          </blockquote>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-semibold text-stone-900">{story.name}</p>
              <p className="text-sm text-stone-500 mt-0.5">{story.role}</p>
            </div>

            {showLink && (
              <Link
                href={`/success-stories#${story.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Full story
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
