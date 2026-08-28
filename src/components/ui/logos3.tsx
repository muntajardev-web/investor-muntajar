// Auto-scrolling logo carousel powered by Embla Carousel + AutoScroll plugin
"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image?: string;
  text?: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
}

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = [],
}: Logos3Props) => {
  return (
    <div className="w-full">
      {heading && (
        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center mb-6">
          {heading}
        </p>
      )}
      <div className="relative mx-auto flex items-center justify-center overflow-hidden">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true, speed: 1 })]}
          className="w-full"
        >
          <CarouselContent className="ml-0 flex items-center">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex shrink-0 basis-auto justify-center px-5 sm:px-8 pl-0"
              >
                <div className="flex shrink-0 items-center justify-center">
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className ?? "h-6 sm:h-7 w-auto object-contain select-none pointer-events-none"}
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-stone-700 tracking-tight whitespace-nowrap select-none">
                      {logo.description}
                    </span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#FAF9F7] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#FAF9F7] to-transparent z-10" />
      </div>
    </div>
  );
};

export { Logos3 };
