import { PageHeader } from "@/components/employment";
import { ProfileBuilder } from "@/components/employment/profile-builder";
import { requireAuth } from "@/server/auth/session";
import { getWorkerProfile } from "@/lib/employment/queries";

export default async function EmploymentProfilePage() {
  const session = await requireAuth();
  const profile = await getWorkerProfile(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Candidate Profile & Bio-Data"
        description="Step 1 — Enter your official identity, passport details, address, and overseas preferences to qualify for international placement."
      />
      <ProfileBuilder
        initial={
          profile
            ? {
                fullName: profile.fullName,
                dateOfBirth: profile.dateOfBirth,
                gender: profile.gender,
                nationality: profile.nationality,
                passportNumber: profile.passportNumber,
                passportExpiry: profile.passportExpiry,
                passportIssueDate: profile.passportIssueDate,
                passportIssuingCountry: profile.passportIssuingCountry,
                currentCountry: profile.currentCountry,
                currentCity: profile.currentCity,
                currentAddress: profile.currentAddress,
                phone: profile.phone,
                email: profile.email,
                maritalStatus: profile.maritalStatus,
                hasDrivingLicense: profile.hasDrivingLicense,
                preferredCountries: profile.preferredCountries,
                preferredSalary: profile.preferredSalary,
                preferredSalaryCurrency: profile.preferredSalaryCurrency,
                preferredJobType: profile.preferredJobType,
                preferredIndustries: profile.preferredIndustries,
                education: profile.education,
                experience: profile.experience,
                skills: profile.skills,
                customSkills: profile.customSkills,
                languages: profile.languages,
                certifications: profile.certifications,
                emergencyContact: profile.emergencyContact,
                photoUrl: profile.photoUrl,
                photoFileName: profile.photoFileName,
                profileCompletion: profile.profileCompletion,
              }
            : {
                email: session.user.email,
                fullName: session.user.name,
                profileCompletion: 0,
              }
        }
      />
    </div>
  );
}
