import { registerEmailTemplate } from "../email.service";

export const EMAIL_VERIFICATION_TEMPLATE = "email-verification";

export interface EmailVerificationData {
  name: string;
  verificationUrl: string;
  verificationCode: string;
}

export function emailVerificationEmail(data: EmailVerificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Verify your email address — Muntajar Global Platform";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F6; color: #1c1917; margin: 0; padding: 24px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 16px; padding: 32px; }
          .logo { font-size: 20px; font-weight: 800; color: #0c0a09; text-decoration: none; display: inline-block; margin-bottom: 24px; }
          .badge { display: inline-block; background-color: #fef3c7; color: #78350f; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; }
          h1 { font-size: 22px; font-weight: 800; color: #0c0a09; margin: 0 0 12px; }
          p { font-size: 14px; line-height: 1.6; color: #57534e; margin: 0 0 20px; }
          .code-box { background-color: #f5f5f4; border: 1px border #e7e5e4; border-radius: 12px; padding: 16px; text-align: center; font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #0c0a09; margin: 20px 0; }
          .btn { display: inline-block; background-color: #0c0a09; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; text-align: center; }
          .footer { font-size: 12px; color: #a8a29e; text-align: center; margin-top: 32px; border-t: 1px solid #f5f5f4; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="https://muntajar.com" class="logo">Muntajar</a>
          <br />
          <span class="badge">SECURITY VERIFICATION</span>
          <h1>Verify Your Email Address</h1>
          <p>Hi ${data.name || "there"}, welcome to Muntajar Global Mobility Platform. Please use the verification code below or click the button to verify your account email.</p>
          
          <div class="code-box">${data.verificationCode}</div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${data.verificationUrl}" class="btn">Verify Account Email</a>
          </div>

          <p>If you didn't create a Muntajar account, you can safely ignore this email.</p>
          <div class="footer">
            Muntajar Global Mobility Platform · All Rights Reserved
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
    Verify your email address for Muntajar Global Mobility Platform.
    Verification Code: ${data.verificationCode}
    Or click link: ${data.verificationUrl}
  `.trim();

  return { subject, html, text };
}

registerEmailTemplate(EMAIL_VERIFICATION_TEMPLATE, (data) =>
  emailVerificationEmail(data as unknown as EmailVerificationData),
);
