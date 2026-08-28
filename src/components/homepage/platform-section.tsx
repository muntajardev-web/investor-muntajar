"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Eye, Layers } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Display } from "@/components/typography/display";
import { Overline } from "@/components/typography/overline";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/homepage/section-reveal";
import { PlatformMockup } from "@/components/homepage/platform-mockup";

const features = [
  {
    icon: Layers,
    title: "One place for everything",
    description: "Documents, milestones, messages, and deadlines — unified.",
  },
  {
    icon: Eye,
    title: "Full transparency",
    description: "See exactly where your application stands at every stage.",
  },
  {
    icon: Shield,
    title: "Secure & private",
    description: "Your documents encrypted. Your data never sold to brokers.",
  },
];

export function PlatformSection() {
  return (
    <section id="platform" className="section-padding bg-stone-50 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <SectionReveal>
            <Overline accent className="mb-4 block">
              The platform
            </Overline>
            <Display size="md" className="mb-6">
              Your entire journey. One operating system.
            </Display>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Upload documents, track milestones, message your advisor, and
              monitor every step — from first consultation to pre-departure. No
              more WhatsApp chaos. No more lost paperwork.
            </p>

            <ul className="space-y-5 mb-10">
              {features.map((feature) => (
                <li key={feature.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{feature.title}</p>
                    <p className="text-sm text-stone-600 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link href="/contact">
                See it in action <ArrowRight />
              </Link>
            </Button>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className="relative">
              <PlatformMockup />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-xl overflow-hidden border-4 border-stone-50 hidden lg:block">
                <Image
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&q=80"
                  alt="Person using laptop for their journey"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            </div>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
