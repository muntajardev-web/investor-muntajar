"use client";

import * as React from "react";
import Image from "next/image";
import {
  Globe,
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Grid, GridItem } from "@/components/layout/grid";
import { Display } from "@/components/typography/display";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Overline } from "@/components/typography/overline";
import { Stat } from "@/components/typography/stat";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input, SearchInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormGroup } from "@/components/ui/form-field";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Timeline } from "@/components/ui/timeline";
import { Stepper } from "@/components/ui/stepper";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CommandPalette } from "@/components/ui/command-palette";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toast";
import { toast } from "sonner";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { SlideUp } from "@/components/motion/slide-up";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import { colors, radius, shadows } from "@/lib/design-tokens";

function TokenSwatch({
  name,
  value,
  className,
}: {
  name: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-16 rounded-lg border border-border-subtle ${className ?? ""}`}
        style={className ? undefined : { backgroundColor: value }}
      />
      <div>
        <p className="text-xs font-medium text-stone-900">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{value}</p>
      </div>
    </div>
  );
}

function DsSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Section id={id} padding="sm" background="default">
      <Container>
        <SlideUp className="mb-12 md:mb-16">
          <Overline accent className="mb-3 block">
            Design System
          </Overline>
          <Heading size="lg" className="mb-3">
            {title}
          </Heading>
          {description && (
            <Text tone="muted" className="max-w-2xl">
              {description}
            </Text>
          )}
        </SlideUp>
        {children}
      </Container>
    </Section>
  );
}

export function DesignSystemShowcase() {
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <>
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <Section padding="default" background="warm" className="relative overflow-hidden">
          <div className="absolute inset-0 texture-grain" />
          <Container className="relative">
            <SlideUp>
              <Overline accent className="mb-4 block">
                Muntajar Design System v2
              </Overline>
              <Display size="lg" className="max-w-4xl mb-6">
                The visual language of a global mobility platform
              </Display>
              <Text size="lg" tone="muted" className="max-w-2xl mb-8">
                Premium, calm, and trustworthy. Neutral palette with warm orange
                as accent only. 8px grid, rounded-xl surfaces, soft shadows.
              </Text>
              <div className="flex flex-wrap gap-3">
                <Button size="lg">
                  Start Your Journey
                  <ArrowRight />
                </Button>
                <Button variant="outline" size="lg">
                  View Components
                </Button>
              </div>
            </SlideUp>
          </Container>
        </Section>

        {/* Colors */}
        <DsSection
          id="colors"
          title="Color System"
          description="Warm orange for accents only. Stone neutrals with warm undertones for the primary experience."
        >
          <div className="space-y-10">
            <div>
              <Heading size="sm" className="mb-6">
                Warm Orange — Accent
              </Heading>
              <Grid cols={6} gap="sm">
                {Object.entries(colors.orange).map(([shade, value]) => (
                  <TokenSwatch key={shade} name={`orange-${shade}`} value={value} />
                ))}
              </Grid>
            </div>
            <div>
              <Heading size="sm" className="mb-6">
                Stone — Neutrals
              </Heading>
              <Grid cols={6} gap="sm">
                {Object.entries(colors.stone).map(([shade, value]) => (
                  <TokenSwatch key={shade} name={`stone-${shade}`} value={value} />
                ))}
              </Grid>
            </div>
            <div className="flex flex-wrap gap-4 p-6 rounded-xl bg-stone-100">
              <Badge variant="accent">Accent usage</Badge>
              <Text size="sm" tone="muted">
                Orange appears on CTAs, progress, icons, active states, numbers,
                and small highlights — never as large background fills.
              </Text>
            </div>
          </div>
        </DsSection>

        {/* Typography */}
        <DsSection
          id="typography"
          title="Typography"
          description="Instrument Serif for editorial display. Geist Sans for UI. Geist Mono for stats and data."
        >
          <div className="space-y-12">
            <div className="space-y-6 pb-8 border-b border-stone-200">
              <Overline>Display XL</Overline>
              <Display size="xl">Your future, designed.</Display>
            </div>
            <div className="space-y-6 pb-8 border-b border-stone-200">
              <Overline>Display LG</Overline>
              <Display size="lg">Global mobility, reimagined.</Display>
            </div>
            <div className="space-y-6 pb-8 border-b border-stone-200">
              <Overline>Display MD</Overline>
              <Display size="md">Not another visa agency.</Display>
            </div>
            <Grid cols={2} gap="lg">
              <div className="space-y-4">
                <Heading size="xl">Heading XL</Heading>
                <Heading size="lg">Heading LG</Heading>
                <Heading size="md">Heading MD</Heading>
                <Heading size="sm">Heading SM</Heading>
              </div>
              <div className="space-y-4">
                <Text size="lg">Body large — for lead paragraphs and editorial content.</Text>
                <Text size="md">Body medium — default reading size for most content.</Text>
                <Text size="sm" tone="muted">Body small — captions, metadata, secondary info.</Text>
                <Overline accent>Overline accent</Overline>
              </div>
            </Grid>
          </div>
        </DsSection>

        {/* Spacing & Grid */}
        <DsSection
          id="spacing"
          title="Spacing & Grid"
          description="8px base grid. Generous section padding. 12-column responsive grid with fluid gaps."
        >
          <Grid cols={12} gap="md" className="mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <GridItem key={i} span={1}>
                <div className="h-20 bg-stone-100 rounded-lg flex items-center justify-center text-xs text-stone-400 font-mono">
                  {i + 1}
                </div>
              </GridItem>
            ))}
          </Grid>
          <div className="flex flex-wrap gap-4">
            {["4", "8", "16", "24", "32", "48", "64", "80", "section"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="bg-orange-100 rounded"
                  style={{
                    width: s === "section" ? "80px" : `${Math.min(Number(s) * 1.5, 96)}px`,
                    height: "8px",
                  }}
                />
                <span className="text-xs font-mono text-stone-500">{s}</span>
              </div>
            ))}
          </div>
        </DsSection>

        {/* Shadows & Radius */}
        <DsSection
          id="shadows"
          title="Shadows & Radius"
          description="Soft, premium shadows. Rounded corners that feel modern without being playful."
        >
          <Grid cols={3} gap="md" className="mb-12">
            {Object.entries(shadows).map(([name]) => (
              <div
                key={name}
                className="h-24 bg-white rounded-xl flex items-center justify-center"
                style={{ boxShadow: `var(--shadow-${name})` }}
              >
                <span className="text-xs font-mono text-stone-500">shadow-{name}</span>
              </div>
            ))}
          </Grid>
          <div className="flex flex-wrap gap-6">
            {Object.entries(radius).map(([name, value]) => (
              <div key={name} className="text-center">
                <div
                  className="w-20 h-20 bg-stone-100 border border-stone-200 mb-2"
                  style={{ borderRadius: value }}
                />
                <span className="text-xs font-mono text-stone-500">
                  {name} ({value})
                </span>
              </div>
            ))}
          </div>
        </DsSection>

        {/* Buttons */}
        <DsSection
          id="buttons"
          title="Buttons"
          description="Primary CTA uses warm orange. Secondary actions stay calm and neutral."
        >
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="flex gap-4">
              <Button size="icon"><ArrowRight /></Button>
              <Button size="icon-sm" variant="outline"><ArrowRight /></Button>
              <Button size="icon-lg" variant="secondary"><ArrowRight /></Button>
            </div>
          </div>
        </DsSection>

        {/* Cards */}
        <DsSection
          id="cards"
          title="Cards"
          description="Minimal borders, soft shadows. Content breathes."
        >
          <Grid cols={3} gap="md">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Subtle border, clean background.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" tone="muted">For general content grouping.</Text>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Soft shadow for emphasis.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text size="sm" tone="muted">For featured content.</Text>
              </CardContent>
            </Card>
            <Card variant="feature">
              <CardHeader>
                <IconWrapper icon={Globe} variant="accent" background="accent" className="mb-2" />
                <CardTitle>Feature Card</CardTitle>
                <CardDescription>Hover interaction included.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="link" className="p-0 h-auto">
                  Learn more <ArrowRight className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </Grid>
        </DsSection>

        {/* Forms */}
        <DsSection
          id="forms"
          title="Forms"
          description="Clean inputs with warm focus rings. Generous touch targets."
        >
          <Card variant="bordered" padding="lg" className="max-w-xl">
            <FormGroup>
              <FormField label="Search" htmlFor="search">
                <SearchInput id="search" placeholder="Search universities…" />
              </FormField>
              <FormField label="Full Name" htmlFor="name" required>
                <Input id="name" placeholder="Enter your full name" />
              </FormField>
              <FormField label="Email" htmlFor="email" required description="We'll never share your email.">
                <Input id="email" type="email" placeholder="you@example.com" />
              </FormField>
              <FormField label="Pathway" htmlFor="pathway">
                <Select>
                  <SelectTrigger id="pathway">
                    <SelectValue placeholder="Select your pathway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="professional">Skilled Professional</SelectItem>
                    <SelectItem value="workforce">Workforce</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Message" htmlFor="message">
                <Textarea id="message" placeholder="Tell us about your goals..." />
              </FormField>
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-stone-600">
                  I agree to the terms and privacy policy
                </label>
              </div>
              <Button className="w-full">Submit</Button>
            </FormGroup>
          </Card>
        </DsSection>

        {/* Data & Progress */}
        <DsSection
          id="data"
          title="Tables, Timeline & Progress"
          description="Structured data display for applications, documents, and journey tracking."
        >
          <div className="space-y-10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>University</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">University of Toronto</TableCell>
                  <TableCell>MSc Computer Science</TableCell>
                  <TableCell><Badge variant="accent">In review</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">TU Munich</TableCell>
                  <TableCell>MS Informatics</TableCell>
                  <TableCell><Badge variant="success">Submitted</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Grid cols={2} gap="lg">
              <Card variant="bordered" padding="md">
                <Heading size="sm" className="mb-4">Timeline</Heading>
                <Timeline
                  items={[
                    { id: "1", title: "Profile completed", status: "complete", timestamp: "Jan 12" },
                    { id: "2", title: "Documents uploaded", status: "current", timestamp: "In progress" },
                    { id: "3", title: "Application submitted", status: "upcoming" },
                  ]}
                />
              </Card>
              <div className="space-y-6">
                <Progress value={68} label="Profile completeness" />
                <div className="flex items-center gap-6">
                  <ProgressRing value={82} label="Match" />
                  <Stepper
                    currentStep={2}
                    steps={[
                      { id: "a", label: "Profile" },
                      { id: "b", label: "Documents" },
                      { id: "c", label: "Apply" },
                    ]}
                  />
                </div>
              </div>
            </Grid>
          </div>
        </DsSection>

        {/* Empty & Loading */}
        <DsSection id="feedback" title="Empty States & Skeletons">
          <Grid cols={2} gap="lg">
            <EmptyState
              icon={GraduationCap}
              title="No saved universities"
              description="Browse recommendations and save programs you're interested in."
              action={{ label: "View recommendations", href: "/check-eligibility" }}
            />
            <SkeletonCard />
          </Grid>
        </DsSection>

        {/* Navigation */}
        <DsSection id="navigation" title="Breadcrumbs & Command Palette">
          <div className="space-y-6">
            <Breadcrumbs
              items={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Applications", href: "/dashboard/applications" },
                { label: "University of Toronto" },
              ]}
            />
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setCommandOpen(true)}>
                Open Command Palette
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Application saved")}
              >
                Show Toast
              </Button>
            </div>
            <CommandPalette
              open={commandOpen}
              onOpenChange={setCommandOpen}
              groups={[
                {
                  heading: "Navigate",
                  items: [
                    { id: "dash", label: "Dashboard", shortcut: "⌘D" },
                    { id: "apps", label: "Applications" },
                  ],
                },
              ]}
            />
          </div>
        </DsSection>

        {/* Badges & Icons */}
        <DsSection id="badges" title="Badges & Icons">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="dark">Dark</Badge>
              <Badge variant="success">Success</Badge>
            </div>
            <div className="flex flex-wrap gap-6">
              <IconWrapper icon={GraduationCap} variant="accent" background="accent" size="lg" />
              <IconWrapper icon={Briefcase} variant="dark" background="subtle" size="lg" />
              <IconWrapper icon={Users} variant="accent" background="accent" size="lg" />
              <IconWrapper icon={Sparkles} variant="accent" size="lg" />
              <IconWrapper icon={CheckCircle2} variant="accent" size="lg" />
            </div>
          </div>
        </DsSection>

        {/* Stats */}
        <Section id="stats" padding="sm" background="muted">
          <Container>
            <SlideUp className="mb-12 md:mb-16">
              <Overline accent className="mb-3 block">Design System</Overline>
              <Heading size="lg" className="mb-3">Statistics</Heading>
            </SlideUp>
            <StaggerChildren>
              <Grid cols={4} gap="lg">
                <StaggerItem><Stat value={12000} suffix="+" label="Journeys guided" /></StaggerItem>
                <StaggerItem><Stat value={45} suffix="+" label="Countries" /></StaggerItem>
                <StaggerItem><Stat value={98} suffix="%" label="Satisfaction rate" /></StaggerItem>
                <StaggerItem><Stat value={0} label="Hidden broker fees" /></StaggerItem>
              </Grid>
            </StaggerChildren>
          </Container>
        </Section>

        {/* Carousel */}
        <DsSection id="carousel" title="Carousel">
          <div className="max-w-3xl mx-auto px-12">
            <Carousel>
              <CarouselContent>
                {["Students", "Professionals", "Workforce"].map((segment) => (
                  <CarouselItem key={segment}>
                    <Card variant="elevated" padding="lg" className="text-center">
                      <Overline accent className="mb-2 block">{segment}</Overline>
                      <Heading size="md">Pathway for {segment}</Heading>
                      <Text tone="muted" className="mt-2">
                        Designed around your future — not just a destination.
                      </Text>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </DsSection>

        {/* Accordion, Dialog & Drawer */}
        <DsSection id="interactive" title="Interactive Components">
          <Grid cols={3} gap="lg">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is Muntajar a visa agency?</AccordionTrigger>
                <AccordionContent>
                  No. Muntajar is a global mobility platform. We sell confidence,
                  clarity, and guidance — not visas. The visa is an outcome of a
                  well-planned journey.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How is this different from brokers?</AccordionTrigger>
                <AccordionContent>
                  Everything is transparent, digital, and career-focused. No hidden
                  fees, no misinformation, no post-payment abandonment.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start your journey</DialogTitle>
                    <DialogDescription>
                      Tell us about your goals and we&apos;ll design the best pathway
                      for your future.
                    </DialogDescription>
                  </DialogHeader>
                  <Button className="w-full">Get Started</Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center justify-center">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <div>
                      <DrawerTitle>Application details</DrawerTitle>
                      <DrawerDescription>
                        Review your submission before sending.
                      </DrawerDescription>
                    </div>
                    <DrawerCloseButton />
                  </DrawerHeader>
                  <DrawerBody>
                    <Text size="sm" tone="muted">
                      All documents verified. Ready to submit.
                    </Text>
                  </DrawerBody>
                  <DrawerFooter>
                    <Button className="w-full">Submit application</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </Grid>
        </DsSection>

        {/* Logo */}
        <DsSection id="logo" title="Brand Logo">
          <Grid cols={2} gap="lg">
            <div className="p-12 bg-white rounded-2xl border border-stone-200 flex items-center justify-center">
              <Image src="/images/logo.png" alt="Muntajar Logo" width={280} height={70} />
            </div>
            <div className="p-12 bg-stone-900 rounded-2xl flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="Muntajar Logo"
                width={280}
                height={70}
                className="brightness-0 invert"
              />
            </div>
          </Grid>
        </DsSection>

        {/* Motion Principles */}
        <DsSection
          id="motion"
          title="Motion Principles"
          description="Subtle, purposeful animation. Framer Motion for UI. GSAP reserved for complex scroll sequences. Always respect prefers-reduced-motion."
        >
          <Card variant="bordered" padding="lg">
            <Grid cols={2} gap="lg">
              <div className="space-y-3 font-mono text-sm">
                <p><span className="text-orange-500">duration.fast</span> — 150ms</p>
                <p><span className="text-orange-500">duration.normal</span> — 200ms</p>
                <p><span className="text-orange-500">duration.slow</span> — 300ms</p>
                <p><span className="text-orange-500">stagger.default</span> — 80ms</p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Scroll reveals use viewport trigger with -80px margin.</p>
                <p>Lenis provides smooth scrolling globally.</p>
                <p>Hover states transition in 150ms.</p>
                <p>Focus rings use brand orange at 25% opacity.</p>
              </div>
            </Grid>
          </Card>
        </DsSection>

        {/* Responsive */}
        <DsSection
          id="responsive"
          title="Responsive Rules"
          description="Mobile-first. Fluid typography. Generous padding that scales with viewport."
        >
          <Card variant="bordered" padding="lg">
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-stone-100 pb-3">
                <span className="text-stone-500">sm</span>
                <span>640px — Mobile landscape</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-3">
                <span className="text-stone-500">md</span>
                <span>768px — Tablet</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-3">
                <span className="text-stone-500">lg</span>
                <span>1024px — Desktop nav appears</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-3">
                <span className="text-stone-500">xl</span>
                <span>1280px — Container max-width</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">2xl</span>
                <span>1536px — Wide layouts</span>
              </div>
            </div>
          </Card>
        </DsSection>

        <Separator />

        <Section padding="sm">
          <Container className="text-center py-8">
            <Overline accent className="mb-3 block">Ready</Overline>
            <Heading size="md" className="mb-4">
              Design system v2 complete
            </Heading>
            <Text tone="muted" className="mb-6">
              All primitives are ready. Next: student dashboard pages.
            </Text>
            <Button size="lg">Begin Homepage</Button>
          </Container>
        </Section>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </>
  );
}
