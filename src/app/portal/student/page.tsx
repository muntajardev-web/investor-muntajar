import { redirect } from "next/navigation";

export default function StudentPortalSignInPage() {
  redirect("/login?portal=student");
}
