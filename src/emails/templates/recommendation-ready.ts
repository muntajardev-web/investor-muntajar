import { registerEmailTemplate } from "../email.service";

export const RECOMMENDATION_READY_TEMPLATE = "recommendation-ready";

export function recommendationReadyEmail(data: {
  name: string;
  count: number;
}) {
  return {
    subject: "Your university recommendations are ready",
    html: `<h1>Recommendations Ready</h1><p>Hi ${data.name}, we found ${data.count} universities matched to your profile.</p>`,
    text: `Hi ${data.name}, we found ${data.count} universities matched to your profile.`,
  };
}

registerEmailTemplate(RECOMMENDATION_READY_TEMPLATE, (data) =>
  recommendationReadyEmail({
    name: String(data.name ?? "there"),
    count: Number(data.count ?? 0),
  }),
);
