import { logger } from "@/lib";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface TemplateEmailOptions {
  to: string;
  template: string;
  data: Record<string, unknown>;
}

const templateRenderers: Record<
  string,
  (data: Record<string, unknown>) => {
    subject: string;
    html: string;
    text: string;
  }
> = {};

export function registerEmailTemplate(
  name: string,
  renderer: (data: Record<string, unknown>) => {
    subject: string;
    html: string;
    text: string;
  },
): void {
  templateRenderers[name] = renderer;
}

import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const emailService = {
  async sendRaw(options: SendEmailOptions): Promise<void> {
    if (resend) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Muntajar Platform <verify@muntajar.com>",
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        logger.info(`[ResendEmail] Successfully sent email to ${options.to}`);
        return;
      } catch (err: any) {
        logger.warn(`[ResendEmail] Resend API error fallback: ${err.message}`);
      }
    }

    // Logging stub for development when RESEND_API_KEY is omitted
    logger.info("[EmailService Stub] Sent email", {
      to: options.to,
      subject: options.subject,
    });
  },

  async send(options: TemplateEmailOptions): Promise<void> {
    const renderer = templateRenderers[options.template];
    if (!renderer) {
      throw new Error(`Unknown email template: ${options.template}`);
    }

    const { subject, html, text } = renderer(options.data);
    await this.sendRaw({ to: options.to, subject, html, text });
  },
};
