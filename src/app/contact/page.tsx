import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/page-layout";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormGroup } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contact } from "@/lib/site-data";
import { images } from "@/lib/images";
import { EditorialImage } from "@/components/layout/editorial-image";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Muntajar — book a consultation, ask questions, or visit our Dhaka office.",
};

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero
        overline="Contact"
        title="Let's map your global journey"
        description="Book a free consultation, ask a question, or visit our office in Dhaka. No sales pressure — just clarity."
        centered
        image={images.hero.contact}
        imageAlt="People connecting over a conversation"
      />
      <section className="section-padding-sm">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="p-8 rounded-2xl border border-stone-200 bg-white">
              <FormGroup>
                <FormField label="Full name" htmlFor="name" required>
                  <Input id="name" placeholder="Your full name" />
                </FormField>
                <FormField label="Email" htmlFor="email" required>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </FormField>
                <FormField label="Phone" htmlFor="phone">
                  <Input id="phone" placeholder="+880..." />
                </FormField>
                <FormField label="I'm interested in" htmlFor="track">
                  <Select>
                    <SelectTrigger id="track"><SelectValue placeholder="Select a pathway" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Abroad (T2)</SelectItem>
                      <SelectItem value="professional">Skilled Professionals (T1)</SelectItem>
                      <SelectItem value="workforce">Workforce (T3)</SelectItem>
                      <SelectItem value="visa">Visa & Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Message" htmlFor="message">
                  <Textarea id="message" placeholder="Tell us about your goals..." />
                </FormField>
                <Button className="w-full" size="lg">Send message</Button>
              </FormGroup>
            </div>
            <div className="space-y-8">
              <EditorialImage
                src={images.editorial.dhakaStreet}
                alt="Dhaka cityscape"
                aspect="video"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Email</h3>
                <a href={`mailto:${contact.email}`} className="text-orange-500 hover:underline">{contact.email}</a>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Phone & WhatsApp</h3>
                <p className="text-stone-600">{contact.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Office</h3>
                <p className="text-stone-600">{contact.address}</p>
              </div>
              <div className="p-6 rounded-xl bg-stone-50 border border-stone-200">
                <p className="text-sm text-stone-600">Prefer a quick check first? Take our eligibility assessment — it takes under a minute.</p>
                <Button variant="link" className="p-0 h-auto mt-2 text-orange-500" asChild>
                  <a href="/check-eligibility">Check eligibility →</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
