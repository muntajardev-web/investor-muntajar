"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Overline } from "@/components/typography/overline";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionReveal } from "@/components/homepage/section-reveal";
import { contact } from "@/lib/site-data";
import { serviceHeroImages } from "@/lib/images";
import type { ServiceTrack } from "@/lib/services-data";

interface ServiceTrackPageProps {
  track: ServiceTrack;
}

export function ServiceTrackPage({ track }: ServiceTrackPageProps) {
  const heroImage = serviceHeroImages[track.slug];

  return (
    <>
      {/* Split hero — dark text left, photo right. No overlay mess. */}
      <section className="border-b border-stone-200 bg-white">
        <Container className="pt-8 pb-0">
          <Link
            href="/#pathways"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to services
          </Link>
        </Container>

        <div className="grid lg:grid-cols-2">
          <Container className="lg:max-w-none lg:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:pr-12 pb-12 lg:py-16 flex flex-col justify-center">
            <Overline accent className="mb-3 block">
              {track.segment}
            </Overline>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-stone-900 mb-4 leading-tight">
              {track.title}
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed mb-6 max-w-lg">
              {track.description}
            </p>
            <ul className="space-y-2.5 mb-8">
              {track.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm text-stone-700">
                  <Check className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">{track.ctaPrimary}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">{track.ctaSecondary}</Link>
              </Button>
              <Button variant="subtle" asChild>
                <Link href="/pricing">{track.ctaPlan}</Link>
              </Button>
            </div>
          </Container>

          <div className="relative min-h-[300px] lg:min-h-[520px] order-first lg:order-last">
            <Image
              src={heroImage}
              alt={track.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Included strip — integrated, not a floating card */}
        <div className="bg-stone-900 text-white">
          <Container className="py-10 md:py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-6">
              What&apos;s included
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mb-8">
              {track.included.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-stone-200">
                  <Check className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-6 pt-6 border-t border-stone-800">
              {track.stats.map((stat) => (
                <p key={stat} className="text-sm font-mono text-orange-400">
                  {stat}
                </p>
              ))}
            </div>
          </Container>
        </div>
      </section>

      <Section padding="sm" background="default">
        <Container>
          <SectionReveal className="mb-10">
            <Overline className="mb-3 block">Who it&apos;s for</Overline>
            <Heading size="lg" className="mb-4">
              Tailored for your pathway
            </Heading>
            <p className="text-stone-600 max-w-2xl">
              Structured mentorship, global-market insights, and step-by-step
              execution support for individuals on the {track.segment.split("—")[0]?.trim()} pathway.
            </p>
          </SectionReveal>
          <div className="grid md:grid-cols-3 gap-px bg-stone-200 rounded-2xl overflow-hidden border border-stone-200">
            {track.audiences.map((a, i) => (
              <SectionReveal key={a.title} delay={i * 0.08}>
                <div className="bg-white p-7 md:p-8 h-full">
                  <span className="font-mono text-xs text-orange-500 mb-3 block">
                    0{i + 1}
                  </span>
                  <h3 className="font-semibold text-stone-900 mb-2">{a.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{a.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm" background="muted">
        <Container>
          <SectionReveal className="mb-12 max-w-2xl">
            <Overline accent className="mb-3 block">Programme blueprint</Overline>
            <Heading size="lg">How the track is delivered</Heading>
            <p className="text-stone-600 mt-3">
              Every cohort follows a modular curriculum with tangible deliverables
              so you can measure maturity at each stage.
            </p>
          </SectionReveal>

          <div className="space-y-0">
            {track.modules.map((mod, i) => (
              <SectionReveal key={mod.title} delay={i * 0.08}>
                <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 py-10 border-t border-stone-300 first:border-t-0 first:pt-0">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono text-sm shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < track.modules.length - 1 && (
                      <div className="hidden md:block w-px flex-1 min-h-[60px] bg-stone-300 ml-[21px]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">{mod.title}</h3>
                    <p className="text-stone-600 mb-5 max-w-2xl">{mod.description}</p>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {mod.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm text-stone-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm" background="default">
        <Container>
          <SectionReveal className="mb-10">
            <Overline className="mb-3 block">Timeline</Overline>
            <Heading size="lg">Sprint cadence for this track</Heading>
          </SectionReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {track.timeline.map((t, i) => (
              <SectionReveal key={t.period} delay={i * 0.08}>
                <div className="pt-6 border-t-2 border-orange-400">
                  <p className="font-mono text-sm text-orange-600 mb-2">{t.period}</p>
                  <h3 className="font-semibold text-stone-900 mb-2">{t.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{t.description}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section padding="sm" background="muted">
        <Container>
          <SectionReveal className="mb-8 max-w-xl">
            <Overline className="mb-3 block">FAQ</Overline>
            <Heading size="md">Frequently asked questions</Heading>
          </SectionReveal>
          <SectionReveal delay={0.1} className="max-w-2xl">
            <Accordion type="single" collapsible>
              {track.faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SectionReveal>
        </Container>
      </Section>

      <Section padding="sm" background="default">
        <Container>
          <div className="rounded-2xl bg-stone-900 text-white p-8 md:p-12 text-center">
            <Heading size="md" className="text-white mb-3">
              Next steps
            </Heading>
            <p className="text-stone-400 max-w-xl mx-auto mb-6">
              Share your goals and documents with our advisors. We&apos;ll map
              training sprints, matching plans, and OnBoard milestones tailored to you.
            </p>
            <p className="text-sm text-stone-500 mb-6">
              Need help? Email{" "}
              <a href={`mailto:${contact.email}`} className="text-orange-400 hover:underline">
                {contact.email}
              </a>{" "}
              or call {contact.phone}
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Schedule strategy session <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
