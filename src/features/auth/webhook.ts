import type { WebhookEvent } from "@clerk/nextjs/server";
import { userRepository } from "@/repositories";
import { logger } from "@/lib";

export async function clerkWebhookHandler(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const { id, email_addresses, first_name, last_name, image_url, phone_numbers } =
        event.data;

      const email = email_addresses[0]?.email_address;
      if (!email) {
        logger.warn("Clerk webhook: user without email", { clerkId: id });
        return;
      }

      await userRepository.upsertByClerkId({
        clerkId: id,
        email,
        name: [first_name, last_name].filter(Boolean).join(" ") || undefined,
        phone: phone_numbers[0]?.phone_number,
        avatarUrl: image_url,
      });

      logger.info("User synced from Clerk", { clerkId: id });
      break;
    }

    case "user.deleted": {
      const user = await userRepository.findByClerkId(event.data.id!);
      if (user) {
        await userRepository.delete(user.id);
        logger.info("User deleted from Clerk sync", { clerkId: event.data.id });
      }
      break;
    }

    default:
      logger.debug("Unhandled Clerk webhook event", { type: event.type });
  }
}
