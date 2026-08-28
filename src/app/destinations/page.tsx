import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { DestinationsPageContent } from "@/components/destinations/destinations-page-content";

export const metadata: Metadata = {
  title: "Explore Global Destinations — Study & Work Corridors | Muntajar",
  description: "Browse verified study, work, and visa destinations across 45+ countries with direct portal admissions and zero middleman markups.",
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main>
        <DestinationsPageContent />
      </main>
      <Footer />
    </>
  );
}
