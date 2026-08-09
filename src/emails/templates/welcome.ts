import { registerEmailTemplate } from "../email.service";

export const WELCOME_TEMPLATE = "welcome";

export function welcomeEmail(data: { name: string }) {
  return {
    subject: `Welcome to Muntajar, ${data.name}!`,
    html: `<h1>Welcome to Muntajar</h1><p>Hi ${data.name}, start your global mobility journey today.</p>`,
    text: `Welcome to Muntajar, ${data.name}! Start your global mobility journey today.`,
  };
}

registerEmailTemplate(WELCOME_TEMPLATE, (data) =>
  welcomeEmail({ name: String(data.name ?? "there") }),
);
