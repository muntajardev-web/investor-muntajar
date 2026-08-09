import { z, type ZodSchema } from "zod";
import { ValidationError } from "@/lib";

export function validateRequest<T>(
  schema: ZodSchema<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Invalid request data", {
      errors: result.error.flatten().fieldErrors,
    });
  }
  return result.data;
}

export { z };
