import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const promises = ["No brokers", "No hidden fees", "Free consultation"];

export function PageCta() {
  return (
    <section className="relative overflow-hidden bg-stone-950">
      <Container className="relative z-10 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 mb-4">
            Ready when you are
          </p>
          <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Ready to start your global journey?
          </h2>
          <p className="text-base font-medium text-stone-400 mb-6 max-w-lg mx-auto">
            Join students, workers, and professionals who trust Muntajar for
            transparent, broker-free guidance.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
            {promises.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-semibold text-stone-300">
                <Check className="w-4 h-4 text-orange-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <a href="https://dash-muntajarx.vercel.app" target="_blank" rel="noopener noreferrer">
                Get Started
                <ArrowRight />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-stone-600 text-white hover:bg-stone-800 bg-transparent"
              asChild
            >
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
