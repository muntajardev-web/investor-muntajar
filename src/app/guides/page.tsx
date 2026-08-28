import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { Container } from "@/components/layout/container";
import { Overline } from "@/components/typography/overline";
import { Display } from "@/components/typography/display";
import { Badge } from "@/components/ui/badge";
import { guideArticles } from "@/lib/pages-data";

export const metadata: Metadata = {
  title: "Guides",
  description: "Study abroad and overseas jobs guides for Bangladesh — broker-free, practical, and up to date.",
};

export default function GuidesPage() {
  return (
    <PageLayout>
      <section className="border-b border-stone-200 bg-stone-50">
        <Container className="section-padding-sm max-w-3xl">
          <Overline accent className="mb-4 block">Guides & resources</Overline>
          <Display size="md" className="mb-4">
            Study abroad & overseas jobs guides for Bangladesh
          </Display>
          <p className="text-lg text-stone-600 leading-relaxed">
            Practical, broker-free guidance on studying abroad, working overseas,
            student visas, and safe migration — written for Bangladeshi students,
            professionals, and workers.
          </p>
        </Container>
      </section>

      <section className="section-padding-sm bg-white">
        <Container className="max-w-3xl">
          <div className="divide-y divide-stone-200">
            {guideArticles.map((guide, i) => (
              <Link
                key={guide.id}
                href={guide.href}
                className="group flex gap-6 md:gap-8 py-10 first:pt-0 last:pb-0 items-start"
              >
                <span className="font-mono text-2xl text-stone-300 group-hover:text-orange-400 transition-colors shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant="accent">{guide.category}</Badge>
                    <span className="text-xs text-stone-400">{guide.readTime}</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-stone-900 group-hover:text-orange-600 transition-colors mb-3 leading-snug">
                    {guide.title}
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4 line-clamp-2">
                    {guide.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 group-hover:gap-2.5 transition-all">
                    Read guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
