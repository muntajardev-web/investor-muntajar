/**
 * Muntajar — Transactional Email Templates
 * All templates return plain HTML strings compatible with Resend.
 */

const brand = {
  primary: "#1a1a1a",
  accent: "#d97706",       // amber-600
  surface: "#fafaf9",
  border: "#e7e5e4",
  text: "#09090b",
  muted: "#78716c",
};

function baseLayout(body: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${brand.surface};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${brand.border};border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid ${brand.border};">
              <span style="font-size:20px;font-weight:800;color:${brand.text};letter-spacing:-0.5px;">Muntajar</span>
              <span style="font-size:12px;font-weight:600;color:${brand.muted};margin-left:8px;">Global Mobility</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${brand.border};background:${brand.surface};">
              <p style="margin:0;font-size:12px;color:${brand.muted};line-height:1.6;">
                Muntajar Global Mobility Platform · Dhaka, Bangladesh<br/>
                Questions? Reply to this email or contact support@muntajar.com<br/>
                <span style="color:${brand.border};">─────────────────────────────</span><br/>
                You received this email because you have an active account on Muntajar.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Welcome email sent after account registration */
export function welcomeEmail(params: {
  name: string;
  role: "Worker & Professional" | "Student & Scholar" | "Investor & Partner";
  loginUrl: string;
}): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;color:${brand.text};letter-spacing:-0.5px;">
      Welcome to Muntajar, ${params.name} 👋
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${brand.muted};line-height:1.7;">
      Your <strong style="color:${brand.text};">${params.role}</strong> account is now active.
      Muntajar connects professionals, students, and investors to the world's best global mobility opportunities.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="background:${brand.primary};border-radius:10px;">
          <a href="${params.loginUrl}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:-0.2px;">
            Open Your Portal →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.6;">
      Your profile, document vault, and job matches are ready. Upload your verified documents to get started.
    </p>
  `;
  return {
    subject: `Welcome to Muntajar, ${params.name} — Your portal is ready`,
    html: baseLayout(body, "Welcome to Muntajar"),
  };
}

/** Sent when a new job application is submitted */
export function applicationSubmittedEmail(params: {
  name: string;
  jobId: string;
  jobTitle: string;
  company: string;
  country: string;
  salary: string;
}): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${brand.text};">
      Application Submitted ✓
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${brand.muted};line-height:1.7;">
      Hi <strong style="color:${brand.text};">${params.name}</strong>,<br/>
      Your application for the position below has been received and is now under review.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.surface};border:1px solid ${brand.border};border-radius:12px;padding:24px;margin-bottom:28px;">
      <tr><td style="padding-bottom:12px;">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:${brand.accent};">${params.jobId}</span>
      </td></tr>
      <tr><td style="padding-bottom:4px;">
        <span style="font-size:20px;font-weight:800;color:${brand.text};">${params.jobTitle}</span>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <span style="font-size:14px;color:${brand.muted};">${params.company} · ${params.country}</span>
      </td></tr>
      <tr><td>
        <span style="font-size:13px;font-weight:700;color:#059669;background:#ecfdf5;padding:4px 12px;border-radius:20px;border:1px solid #a7f3d0;">
          ${params.salary} / month
        </span>
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.7;">
      <strong style="color:${brand.text};">What happens next?</strong><br/>
      Our team will review your profile and documents within 3–5 business days.
      You will receive an update via email once your application moves to the next phase.
    </p>
  `;
  return {
    subject: `Application submitted — ${params.jobTitle} at ${params.company}`,
    html: baseLayout(body, "Application Submitted"),
  };
}

/** Sent when a document is verified or requires action */
export function documentStatusEmail(params: {
  name: string;
  documentType: string;
  status: "Verified" | "Action Required" | "Rejected";
  notes?: string;
}): { subject: string; html: string } {
  const statusColor =
    params.status === "Verified"
      ? "#059669"
      : params.status === "Action Required"
        ? "#d97706"
        : "#dc2626";

  const statusBg =
    params.status === "Verified"
      ? "#ecfdf5"
      : params.status === "Action Required"
        ? "#fffbeb"
        : "#fef2f2";

  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${brand.text};">
      Document Update
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${brand.muted};line-height:1.7;">
      Hi <strong style="color:${brand.text};">${params.name}</strong>,<br/>
      Your document has been reviewed. Here is the status update:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.surface};border:1px solid ${brand.border};border-radius:12px;padding:24px;margin-bottom:24px;">
      <tr><td style="padding-bottom:8px;">
        <span style="font-size:14px;color:${brand.muted};">Document Type</span>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <strong style="font-size:18px;color:${brand.text};">${params.documentType}</strong>
      </td></tr>
      <tr><td>
        <span style="font-size:13px;font-weight:700;color:${statusColor};background:${statusBg};padding:6px 16px;border-radius:20px;">
          ${params.status}
        </span>
      </td></tr>
    </table>
    ${
      params.notes
        ? `<p style="margin:0;font-size:13px;color:${brand.muted};background:${brand.surface};border:1px solid ${brand.border};border-radius:10px;padding:16px;line-height:1.7;">
        <strong style="color:${brand.text};">Note from your advisor:</strong><br/>${params.notes}
      </p>`
        : ""
    }
  `;
  return {
    subject: `Document ${params.status} — ${params.documentType}`,
    html: baseLayout(body, `Document ${params.status}`),
  };
}

/** Visa milestone update email */
export function visaMilestoneEmail(params: {
  name: string;
  milestone: string;
  description: string;
  nextStep: string;
  estimatedDate?: string;
}): { subject: string; html: string } {
  const body = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${brand.text};">
      Visa Application Update 🎯
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${brand.muted};line-height:1.7;">
      Hi <strong style="color:${brand.text};">${params.name}</strong>,<br/>
      Your visa application has reached a new milestone.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.surface};border:1px solid ${brand.border};border-radius:12px;padding:24px;margin-bottom:28px;">
      <tr><td style="padding-bottom:4px;">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;color:${brand.accent};">Current Milestone</span>
      </td></tr>
      <tr><td style="padding-bottom:12px;">
        <strong style="font-size:20px;color:${brand.text};">${params.milestone}</strong>
      </td></tr>
      <tr><td style="padding-bottom:16px;border-top:1px solid ${brand.border};padding-top:16px;">
        <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.7;">${params.description}</p>
      </td></tr>
      <tr><td>
        <strong style="font-size:13px;color:${brand.text};">Next Step:</strong>
        <p style="margin:4px 0 0;font-size:13px;color:${brand.muted};line-height:1.6;">${params.nextStep}</p>
      </td></tr>
      ${
        params.estimatedDate
          ? `<tr><td style="padding-top:16px;">
          <span style="font-size:12px;color:${brand.muted};">Estimated Date: <strong style="color:${brand.text};">${params.estimatedDate}</strong></span>
        </td></tr>`
          : ""
      }
    </table>
  `;
  return {
    subject: `Visa Update — ${params.milestone}`,
    html: baseLayout(body, "Visa Application Update"),
  };
}
