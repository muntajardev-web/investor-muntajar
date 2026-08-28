import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StoryTestimonial } from "@/components/stories/story-testimonial";
import { successStories } from "@/lib/homepage-data";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Success Stories",
  description: "Real Bangladeshi journeys — students, professionals, and workers who reached their goals abroad with Muntajar.",
};

export default function SuccessStoriesPage() {
  return (
    <PageLayout>
      <PageHero
        overline="Success stories"
        title="Real Bangladeshi journeys, transparent every step"
        description="Students, professionals, and skilled workers who reached their goals abroad with broker-free, ILO-aligned guidance — and no hidden fees."
        image={images.hero.stories}
        imageAlt="Graduates celebrating their achievement"
      >
        <div className="flex flex-wrap gap-4 mt-8">
          <Button asChild><Link href="/contact">Talk to an advisor</Link></Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild><Link href="/check-eligibility">Start your journey</Link></Button>
        </div>
      </PageHero>
      <section className="section-padding-sm bg-stone-50">
        <Container>
          <div className="rounded-3xl bg-white border border-stone-200 px-6 md:px-10 lg:px-14">
            {successStories.map((story, i) => (
              <StoryTestimonial key={story.id} story={story} index={i} />
            ))}
          </div>

          <div className="mt-16 text-center p-8 md:p-10 rounded-2xl bg-stone-900 text-white">
            <h3 className="text-xl font-semibold mb-2">Your story could be next</h3>
            <p className="text-stone-400 mb-6 max-w-lg mx-auto">Explore our service tracks or browse destination countries.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild><Link href="/services/study-abroad">Get started</Link></Button>
              <Button variant="outline" className="border-stone-600 text-white hover:bg-stone-800 bg-transparent" asChild><Link href="/destinations">Browse destinations</Link></Button>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
