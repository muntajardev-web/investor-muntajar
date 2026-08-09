"use client";

import { Container } from "@/components/layout/container";
import { MarqueeLogoScroller } from "@/components/ui/marquee-logo-scroller";

const partners = [
  {
    src: 'https://svgl.app/library/procure.svg',
    alt: 'Procure',
    gradient: { from: '#668CFF', via: '#0049FF', to: '#003199' },
  },
  {
    src: 'https://svgl.app/library/shopify.svg',
    alt: 'Shopify',
    gradient: { from: '#FFE766', via: '#FFCE00', to: '#B38F00' },
  },
  {
    src: 'https://svgl.app/library/blender.svg',
    alt: 'Blender',
    gradient: { from: '#6690F0', via: '#255BE3', to: '#193B99' },
  },
  {
    src: 'https://svgl.app/library/figma.svg',
    alt: 'Figma',
    gradient: { from: '#C4C2FF', via: '#9896FF', to: '#5B4DCC' },
  },
  {
    src: 'https://svgl.app/library/spotify.svg',
    alt: 'Spotify',
    gradient: { from: '#FF66A1', via: '#FF007A', to: '#B3005A' },
  },
  {
    src: 'https://svgl.app/library/lottielab.svg',
    alt: 'Lottielab',
    gradient: { from: '#D9FF5A', via: '#AFFF01', to: '#7A9900' },
  },
  {
    src: 'https://svgl.app/library/google-cloud.svg',
    alt: 'Google Cloud',
    gradient: { from: '#8AA7FF', via: '#5F86FF', to: '#3A5ACC' },
  },
  {
    src: 'https://svgl.app/library/bing.svg',
    alt: 'Bing',
    gradient: { from: '#67F0D1', via: '#2AE5B9', to: '#1B8F72' },
  },
];

export function PartnerScrollerSection() {
  return (
    <section className="dark pt-24 md:pt-32 pb-12 md:pb-16 bg-[#0A0A0A] border-b border-stone-900">
      <Container>
        <MarqueeLogoScroller
          title="Trusted by Businesses Worldwide"
          description="Founders, developers, and business leaders across the globe chose us for their digital asset operations."
          logos={partners}
          speed="normal"
          className="border-stone-900 bg-stone-900/10 text-white"
        />
      </Container>
    </section>
  );
}
