export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
  amount: number;
  deedId: string;
  serialNumber: string;
  status: "CONFIRMED" | "PENDING" | "VIP";
  joinDate: string;
  paymentMethod: string;
  transactionId: string;
  passwordHash?: string;
  plainPassword?: string;
  referredBy?: string; // deed ID or user ID of the referring investor
}

export interface ExecutiveLetter {
  id: string;
  date: string;
  title: string;
  author: string;
  category: string;
  preview: string;
  readTime: string;
  content?: string;
}

export interface PayoutRequest {
  id: string;
  investorName: string;
  date: string;
  method: string;
  amount: number;
  status: "Completed" | "Processing" | "Declined";
  tranId: string;
}

export interface InvestorConfig {
  ticketPriceBDT: number;
  projectedMultiplier: number;
  nextDividendPayout: string;
  dividendCycleLabel: string;
  shareClass: string;
  referralCommissionPercent: number;
  promoCode: string;
  referralBaseLink: string;
}

export const INITIAL_INVESTORS: Investor[] = [
  {
    id: "INV-1001",
    name: "Dr. Anisur Rahman",
    email: "anis.rahman@example.com",
    phone: "+8801711223344",
    tickets: 5,
    amount: 100000,
    deedId: "MJR-2026-8842",
    serialNumber: "MNT-SEC-2026-08942",
    status: "VIP",
    joinDate: "Aug 10, 2026",
    paymentMethod: "Bank Transfer (City Bank)",
    transactionId: "SSL-TXN-2026-8842",
  },
  {
    id: "INV-1002",
    name: "Tariqul Islam",
    email: "tariqul.i@example.com",
    phone: "+8801812345678",
    tickets: 3,
    amount: 60000,
    deedId: "MJR-2026-8843",
    serialNumber: "MNT-SEC-2026-08943",
    status: "CONFIRMED",
    joinDate: "Aug 12, 2026",
    paymentMethod: "bKash Merchant",
    transactionId: "SSL-TXN-2026-8843",
  },
  {
    id: "INV-1003",
    name: "Sabrina Hossain",
    email: "sabrina.h@example.com",
    phone: "+8801912345678",
    tickets: 2,
    amount: 40000,
    deedId: "MJR-2026-8844",
    serialNumber: "MNT-SEC-2026-08944",
    status: "CONFIRMED",
    joinDate: "Aug 15, 2026",
    paymentMethod: "Nagad Escrow",
    transactionId: "SSL-TXN-2026-8844",
  },
  {
    id: "INV-1004",
    name: "Mahmudul Hasan",
    email: "mahmud.h@example.com",
    phone: "+8801612345678",
    tickets: 1,
    amount: 20000,
    deedId: "MJR-2026-8845",
    serialNumber: "MNT-SEC-2026-08945",
    status: "PENDING",
    joinDate: "Aug 18, 2026",
    paymentMethod: "BRAC Bank Transfer",
    transactionId: "SSL-TXN-2026-8845",
  },
];

export const INITIAL_LETTERS: ExecutiveLetter[] = [
  {
    id: "letter-1",
    date: "August 20, 2026",
    title: "Q3 2026 Operations & Mobility Fleet Audit",
    author: "Muntajar Executive Board",
    category: "Operational Audit",
    preview: "Comprehensive update on electric fleet deployment across 12 strategic corridors and RJSC share register sync.",
    readTime: "4 min read",
  },
  {
    id: "letter-2",
    date: "August 14, 2026",
    title: "Angel Shareholder Equity Certificate Issuance Notice",
    author: "Legal & Regulatory Compliance Office",
    category: "Compliance Update",
    preview: "All Class A seed preferred ticket holders have been granted statutory certificates under Companies Act 1994.",
    readTime: "3 min read",
  },
];

export const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: "WTH-9921",
    investorName: "Dr. Anisur Rahman",
    date: "Aug 22, 2026",
    method: "bKash (01712-***678)",
    amount: 2000,
    status: "Completed",
    tranId: "BK9928190",
  },
  {
    id: "WTH-9918",
    investorName: "Tariqul Islam",
    date: "Aug 15, 2026",
    method: "City Bank (A/C: 1102***891)",
    amount: 4000,
    status: "Completed",
    tranId: "CBL8829102",
  },
];

export const INITIAL_CONFIG: InvestorConfig = {
  ticketPriceBDT: 20000,
  projectedMultiplier: 1.6,
  nextDividendPayout: "Oct 15, 2026",
  dividendCycleLabel: "Q3 2026 Distribution Cycle",
  shareClass: "Class A Seed Preferred Equity",
  referralCommissionPercent: 5,
  promoCode: "MUNTAJAR-SEED88",
  referralBaseLink: "https://muntajar.com/investors?ref=MJR-INV-8842",
};

const STORAGE_KEYS = {
  INVESTORS: "muntajar_investors_list",
  LETTERS: "muntajar_executive_letters",
  PAYOUTS: "muntajar_payout_requests",
  CONFIG: "muntajar_investor_config",
};

// Global Server Store for Node.js API runtime
const globalServerStore = (globalThis as any).__MUNTAJAR_SERVER_STORE__ || {
  investors: [...INITIAL_INVESTORS],
  letters: [...INITIAL_LETTERS],
  payouts: [...INITIAL_PAYOUTS],
  config: { ...INITIAL_CONFIG },
};
(globalThis as any).__MUNTAJAR_SERVER_STORE__ = globalServerStore;

export function getStoredInvestorData() {
  if (typeof window === "undefined") {
    return globalServerStore;
  }

  try {
    const rawInvestors = localStorage.getItem(STORAGE_KEYS.INVESTORS);
    const rawLetters = localStorage.getItem(STORAGE_KEYS.LETTERS);
    const rawPayouts = localStorage.getItem(STORAGE_KEYS.PAYOUTS);
    const rawConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);

    const localInvestors = rawInvestors ? JSON.parse(rawInvestors) : globalServerStore.investors;
    const localLetters = rawLetters ? JSON.parse(rawLetters) : globalServerStore.letters;
    const localPayouts = rawPayouts ? JSON.parse(rawPayouts) : globalServerStore.payouts;
    const localConfig = rawConfig ? JSON.parse(rawConfig) : globalServerStore.config;

    // Merge into globalServerStore
    globalServerStore.investors = localInvestors;
    globalServerStore.letters = localLetters;
    globalServerStore.payouts = localPayouts;
    globalServerStore.config = localConfig;

    return {
      investors: localInvestors,
      letters: localLetters,
      payouts: localPayouts,
      config: localConfig,
    };
  } catch (err) {
    return globalServerStore;
  }
}

export function saveStoredInvestorData(data: {
  investors?: Investor[];
  letters?: ExecutiveLetter[];
  payouts?: PayoutRequest[];
  config?: InvestorConfig;
}) {
  if (data.investors) globalServerStore.investors = data.investors;
  if (data.letters) globalServerStore.letters = data.letters;
  if (data.payouts) globalServerStore.payouts = data.payouts;
  if (data.config) globalServerStore.config = data.config;

  if (typeof window === "undefined") return;

  try {
    if (data.investors) {
      localStorage.setItem(STORAGE_KEYS.INVESTORS, JSON.stringify(data.investors));
    }
    if (data.letters) {
      localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(data.letters));
    }
    if (data.payouts) {
      localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(data.payouts));
    }
    if (data.config) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
    }

    window.dispatchEvent(new Event("muntajar-investor-data-updated"));
  } catch (err) {
    console.error("Failed to save investor store to localStorage:", err);
  }
}

export function generateStrongPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const nums = "23456789";
  const special = "!@#$%^&*";

  const getRandomChar = (str: string) => str.charAt(Math.floor(Math.random() * str.length));

  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  const password = `MJR#${getRandomChar(upper)}${getRandomChar(lower)}${getRandomChar(nums)}${randomHex}${getRandomChar(special)}2026!`;
  return password;
}

export function addInvestorFromPayment(params: {
  name: string;
  email: string;
  phone: string;
  tickets: number;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
  passwordHash?: string;
  plainPassword?: string;
  referredBy?: string;
}) {
  const current = getStoredInvestorData();
  const newDeedId = `MJR-2026-${Math.floor(8000 + Math.random() * 1000)}`;
  const newSerial = `MNT-SEC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newTranId = params.transactionId || `SSL-TXN-${Date.now().toString().slice(-6)}`;

  const newInv: Investor = {
    id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    name: params.name,
    email: params.email,
    phone: params.phone || "+8801700000000",
    tickets: params.tickets,
    amount: params.amount,
    deedId: newDeedId,
    serialNumber: newSerial,
    status: "CONFIRMED",
    joinDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    paymentMethod: params.paymentMethod || "SSLCommerz Gateway",
    transactionId: newTranId,
    passwordHash: params.passwordHash,
    plainPassword: params.plainPassword,
    referredBy: params.referredBy,
  };

  const updatedInvestors = [newInv, ...current.investors];
  saveStoredInvestorData({ investors: updatedInvestors });
  return newInv;
}

export function submitPayoutRequest(params: {
  investorName: string;
  method: string;
  accountNumber: string;
  amount: number;
}) {
  const current = getStoredInvestorData();
  const newId = `WTH-${Math.floor(1000 + Math.random() * 9000)}`;
  const newRecord: PayoutRequest = {
    id: newId,
    investorName: params.investorName,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    method: `${params.method} (${params.accountNumber})`,
    amount: params.amount,
    status: "Processing",
    tranId: `PEND-${Date.now().toString().slice(-6)}`,
  };

  const updatedPayouts = [newRecord, ...current.payouts];
  saveStoredInvestorData({ payouts: updatedPayouts });
  return newRecord;
}
