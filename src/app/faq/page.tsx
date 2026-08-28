import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqCategories } from "@/lib/pages-data";
import { images } from "@/lib/images";
import { EditorialImage } from "@/components/layout/editorial-image";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about study abroad, overseas jobs, visas, documents, and payments with Muntajar.",
};

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHero
        overline="Help center"
        title="Frequently asked questions"
        description="Everything you need to know about studying abroad, overseas jobs, visas, documents, and payments with Muntajar. Still stuck? Our advisors are one message away."
        centered
        image={images.editorial.laptopStudy}
        imageAlt="Student researching study abroad options"
      />
      <section className="section-padding-sm">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="hidden lg:block">
              <EditorialImage
                src={images.editorial.documents}
                alt="Visa and application documents organized on a desk"
                aspect="portrait"
                sizes="300px"
              />
            </div>
            <div className="lg:col-span-2">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12">
              <h2 className="text-lg font-semibold text-stone-900 mb-4">{category.title}</h2>
              <Accordion type="single" collapsible>
                {category.items.map((item, i) => (
                  <AccordionItem key={item.question} value={`${category.title}-${i}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent className="text-stone-600 leading-relaxed">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          <div className="text-center pt-8 border-t border-stone-200 mt-8">
            <p className="text-stone-600 mb-4">Still have questions?</p>
            <Button asChild><Link href="/contact">Talk to an Advisor</Link></Button>
          </div>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
