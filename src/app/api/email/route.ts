import { NextRequest, NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";
import {
  welcomeEmail,
  applicationSubmittedEmail,
  documentStatusEmail,
  visaMilestoneEmail,
} from "@/lib/email-templates";
import { env } from "@/config";

const FROM = env.RESEND_FROM_EMAIL || "noreply@muntajar.com";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, to, data } = body as {
    type: "welcome" | "application" | "document" | "visa";
    to: string;
    data: Record<string, string>;
  };

  if (!to || !type) {
    return NextResponse.json({ error: "Missing `to` or `type`" }, { status: 400 });
  }

  let template: { subject: string; html: string };

  switch (type) {
    case "welcome":
      template = welcomeEmail({
        name: data.name,
        role: (data.role as "Worker & Professional" | "Student & Scholar" | "Investor & Partner") ?? "Worker & Professional",
        loginUrl: data.loginUrl ?? `${env.NEXT_PUBLIC_APP_URL}/portal/worker`,
      });
      break;
    case "application":
      template = applicationSubmittedEmail({
        name: data.name,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        company: data.company,
        country: data.country,
        salary: data.salary,
      });
      break;
    case "document":
      template = documentStatusEmail({
        name: data.name,
        documentType: data.documentType,
        status: (data.status as "Verified" | "Action Required" | "Rejected") ?? "Action Required",
        notes: data.notes,
      });
      break;
    case "visa":
      template = visaMilestoneEmail({
        name: data.name,
        milestone: data.milestone,
        description: data.description,
        nextStep: data.nextStep,
        estimatedDate: data.estimatedDate,
      });
      break;
    default:
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
  }

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
