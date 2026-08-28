import type { PaymentProvider } from "@prisma/client";

export type PaymentSource = "employment" | "onboarding";

export type CheckoutProvider =
  | "STRIPE"
  | "SSLCOMMERZ"
  | "BKASH"
  | "NAGAD"
  | "MANUAL";

export const EMPLOYMENT_CHECKOUT_PROVIDERS: {
  id: CheckoutProvider;
  label: string;
  description: string;
}[] = [
  {
    id: "STRIPE",
    label: "Stripe",
    description: "Cards and international wallets",
  },
  {
    id: "SSLCOMMERZ",
    label: "SSLCommerz",
    description: "Cards, mobile banking, and local gateways",
  },
  {
    id: "BKASH",
    label: "bKash",
    description: "Pay with your bKash wallet",
  },
  {
    id: "NAGAD",
    label: "Nagad",
    description: "Pay with your Nagad wallet",
  },
];

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitAmount: number;
  total: number;
};

export type CreateCheckoutInput = {
  userId: string;
  amount: number;
  currency: string;
  description: string;
  provider: CheckoutProvider;
  source: PaymentSource;
  successPath: string;
  cancelPath: string;
  customerEmail?: string | null;
  customerName?: string | null;
  planName?: string;
};

export type CheckoutSessionResult = {
  paymentId: string;
  provider: PaymentProvider;
  status: string;
  demoMode: boolean;
  checkoutUrl: string | null;
  clientSecret?: string | null;
  alreadyPaid?: boolean;
};

export type ProviderSessionInput = {
  paymentId: string;
  amount: number;
  currency: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string | null;
  customerName?: string | null;
};

export type ProviderSessionResult = {
  checkoutUrl: string | null;
  providerRef: string;
  clientSecret?: string | null;
  demoMode: boolean;
  raw?: Record<string, unknown>;
};
