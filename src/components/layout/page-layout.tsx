import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { PageCta } from "@/components/layout/page-cta";

interface PageLayoutProps {
  children: React.ReactNode;
  showCta?: boolean;
}

export function PageLayout({ children, showCta = true }: PageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] md:pt-20">{children}</main>
      {showCta && <PageCta />}
      <Footer />
    </>
  );
}
