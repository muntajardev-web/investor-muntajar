import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_FzdQxZsg_PoScitii3ytx7KMcdcB6EyQC";
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@test.brnnd.com";

const resend = new Resend(apiKey);

export async function sendOtpEmail(email: string, otpCode: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Muntajar <${fromEmail}>`,
      to: [email],
      // ✅ No OTP in subject — a major spam trigger
      subject: `Your Muntajar verification code`,
      // ✅ Clean, minimal transactional template — no excessive images, colors, or marketing language
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Muntajar Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;border:1px solid #e0e0e0;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 20px 36px;border-bottom:1px solid #eeeeee;">
              <span style="font-size:18px;font-weight:700;color:#111111;letter-spacing:-0.3px;">Muntajar</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px 24px 36px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#333333;line-height:1.5;">
                Hi ${name},
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#333333;line-height:1.5;">
                Here is your one-time verification code to complete your investor registration:
              </p>

              <!-- OTP block — simple, no decorative borders -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="background:#f7f7f7;border:1px solid #dddddd;border-radius:6px;padding:16px 32px;font-size:28px;font-weight:700;color:#111111;letter-spacing:6px;font-family:'Courier New',Courier,monospace;">
                    ${otpCode}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-size:13px;color:#666666;line-height:1.5;">
                This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
              </p>
              <p style="margin:0;font-size:13px;color:#666666;line-height:1.5;">
                If you did not request this, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 36px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
                Muntajar Global Mobility Platform &bull; Dhaka, Bangladesh<br/>
                This is an automated transactional email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("Resend OTP send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send OTP email via Resend:", error);
    return { success: false, error: error?.message || "Email dispatch failed" };
  }
}

export async function sendInvestorWelcomeEmail(params: {
  email: string;
  name: string;
  deedId: string;
  tickets: number;
  amount: number;
  password: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Muntajar <${fromEmail}>`,
      to: [params.email],
      // ✅ Plain, professional subject — no emojis or special chars
      subject: `Your Muntajar investor account is ready`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Investor Account Details</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;border:1px solid #e0e0e0;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 36px 20px 36px;border-bottom:1px solid #eeeeee;">
              <span style="font-size:18px;font-weight:700;color:#111111;letter-spacing:-0.3px;">Muntajar</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px 24px 36px;">
              <p style="margin:0 0 16px 0;font-size:15px;color:#333333;line-height:1.5;">
                Hi ${params.name},
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;color:#333333;line-height:1.5;">
                Thank you for completing your investment. Your payment of <strong>BDT ${params.amount.toLocaleString()}</strong> for ${params.tickets} seed ticket${params.tickets > 1 ? "s" : ""} has been confirmed and your investor account is now active.
              </p>

              <!-- Details table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e0e0e0;border-radius:6px;margin:0 0 24px 0;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#666666;width:40%;">Portal</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#111111;font-weight:600;">
                    <a href="${(process.env.NEXT_PUBLIC_APP_URL || "https://investor.muntajar.com").replace(/\/$/, "")}/investor-dashboard" style="color:#EA580C;text-decoration:underline;font-weight:700;">Open Investor Dashboard</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#666666;">Login email</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#111111;font-weight:600;">${params.email}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#666666;">Password</td>
                  <td style="padding:14px 18px;border-bottom:1px solid #eeeeee;font-size:13px;color:#111111;font-family:'Courier New',Courier,monospace;font-weight:700;">${params.password}</td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;font-size:13px;color:#666666;">Deed ID</td>
                  <td style="padding:14px 18px;font-size:13px;color:#111111;font-family:'Courier New',Courier,monospace;font-weight:700;">${params.deedId}</td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#666666;line-height:1.5;">
                Please save your password somewhere safe. For any changes to your credentials or for support, contact the moderator.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 36px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
                Muntajar Global Mobility Platform &bull; Dhaka, Bangladesh<br/>
                This is an automated transactional email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("Resend Welcome email send error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to send welcome email via Resend:", error);
    return { success: false, error: error?.message || "Email dispatch failed" };
  }
}
