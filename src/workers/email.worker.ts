import { emailService } from "@/emails";
import { logger } from "@/lib";
import type { SendEmailPayload } from "./types";

export async function processEmailJob(payload: SendEmailPayload): Promise<void> {
  logger.info("Processing email job", {
    to: payload.to,
    template: payload.template,
  });

  await emailService.send({
    to: payload.to,
    template: payload.template,
    data: payload.data,
  });
}
