import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { ServiceTrackPage } from "@/components/services/service-track-page";
import { getServiceTrack } from "@/lib/services-data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return [
    { slug: "study-abroad" },
    { slug: "skilled-professionals" },
    { slug: "workforce" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const track = getServiceTrack(slug);
  if (!track) return { title: "Service" };
  return {
    title: track.title,
    description: track.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const track = getServiceTrack(slug);
  if (!track) notFound();

  return (
    <PageLayout>
      <ServiceTrackPage track={track} />
    </PageLayout>
  );
}
