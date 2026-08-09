import { PageHeader } from "@/components/employment";
import { CvBuilder } from "@/components/employment/resume-builder/cv-builder";
import { requireAuth } from "@/server/auth/session";
import { prisma } from "@/lib/prisma";

export default async function EmploymentBuilderPage() {
  const session = await requireAuth();

  let profile: any = null;

  try {
    profile = await prisma.workerProfile.findUnique({
      where: { userId: session.user.id },
    });
  } catch {
    // Dev demo fallback
  }

  const initialCvData = {
    fullName: profile?.fullName || session.user.name || "Tashin Ahmed Khan",
    email: profile?.email || session.user.email || "tashin.khan@muntajar.com",
    phone: profile?.phone || "+880 1712-345678",
    location: profile?.currentCity && profile?.currentCountry ? `${profile.currentCity}, ${profile.currentCountry}` : "Dhaka, Bangladesh",
    passportNumber: profile?.passportNumber || "A09876543",
    passportExpiry: profile?.passportExpiry ? new Date(profile.passportExpiry).toISOString().slice(0, 10) : "2031-10-15",
    nationality: profile?.nationality || "Bangladeshi",
    hasDrivingLicense: !!profile?.hasDrivingLicense,
    skills: profile?.skills?.length ? profile.skills : ["Electrician", "HVAC Technician", "Plumber", "Civil Engineering"],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume & Application Studio"
        description="Step 7 — Build Europass, Gulf, and ATS-optimized professional CVs from your profile. Customize, enhance with AI, and download print-ready PDFs."
      />

      <CvBuilder initialData={initialCvData} />
    </div>
  );
}
