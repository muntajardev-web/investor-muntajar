"use client";

import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import { Container } from "@/components/layout/container";
import { Stat } from "@/components/typography/stat";
import { Overline } from "@/components/typography/overline";
import { trustStats } from "@/lib/homepage-data";

export function TrustSection() {
  return (
    <section id="trust" className="py-16 md:py-20 border-b border-stone-200 bg-white">
      <Container>
        <StaggerChildren>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <StaggerItem>
              <Overline accent className="mb-3 block">
                Built on trust
              </Overline>
              <p className="text-2xl md:text-3xl font-display text-stone-900 max-w-lg leading-snug">
                Numbers that reflect real journeys — not marketing claims.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Every statistic represents a Bangladeshi who chose transparency
                over brokers, clarity over confusion, and a platform over
                paperwork chaos.
              </p>
            </StaggerItem>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {trustStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <Stat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>
      </Container>
    </section>
  );
}
