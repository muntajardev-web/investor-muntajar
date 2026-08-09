import { requireAuth } from "@/server/auth/session";
import { getStudentProfile } from "@/lib/student/queries";
import { PageHeader } from "@/components/student";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await requireAuth();
  const profile = await getStudentProfile(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Update your academics, English scores, budget, and study goals."
      />
      <ProfileForm
        initial={
          profile
            ? {
                ...profile,
                budget: profile.budget ? Number(profile.budget) : null,
              }
            : null
        }
      />
    </div>
  );
}
