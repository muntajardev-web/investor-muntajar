import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AboutPageContent } from "@/components/about/about-page-content";

export const metadata: Metadata = {
  title: "About Us | Muntajar — Global Mobility Platform",
  description: "Learn how Muntajar is disrupting predatory agency brokers in South Asia through direct university admissions, ethical workforce migration, and zero middleman markups.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutPageContent />
      </main>
      <Footer />
    </>
  );
}
