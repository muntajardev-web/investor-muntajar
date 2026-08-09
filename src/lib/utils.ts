import { randomUUID } from "crypto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return randomUUID();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isDummyClerkKey(key?: string): boolean {
  if (!key) return true;
  return (
    key.includes("placeholder") ||
    key.includes("XXXXXXXXXXXXXXXX") ||
    key.includes("muntajar") ||
    key.includes("bXVudGFqYX") ||
    !key.includes("$")
  );
}

